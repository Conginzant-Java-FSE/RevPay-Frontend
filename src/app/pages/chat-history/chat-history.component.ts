import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TransactionService } from '../../core/services/transaction.service';
import { MoneyRequestService } from '../../core/services/money-request.service';
import { WalletService } from '../../core/services/wallet.service';
import { Transaction } from '../../core/models';

/** A unique peer derived from counterparty data in transaction history */
export interface ChatPeer {
  userId:        number;
  fullName:      string;
  email:         string;
  initials:      string;
  lastAmount:    number;
  lastType:      string;
  lastNote:      string;
  lastCreatedAt: string;
  transactions:  Transaction[];
}

type SendStep = 'idle' | 'form' | 'pin' | 'success' | 'error';

@Component({
  selector: 'app-chat-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-history.component.html',
  styleUrls: ['./chat-history.component.scss'],
})
export class ChatHistoryComponent implements OnInit {

  // ── Data ─────────────────────────────────────────────────────
  loading       = true;
  peers: ChatPeer[] = [];
  walletBalance = 0;

  // ── Active chat ───────────────────────────────────────────────
  activePeer: ChatPeer | null = null;

  // ── Send flow ─────────────────────────────────────────────────
  sendStep: SendStep = 'idle';
  sendAmount = '';
  sendNote   = '';
  pin        = '';
  showPin    = false;
  sendError  = '';
  sending    = false;

  // ── Transaction detail sheet ──────────────────────────────────
  selectedTxn: Transaction | null = null;

  // ── Search ────────────────────────────────────────────────────
  search = '';

  constructor(
    private txnService:  TransactionService,
    private sendService: MoneyRequestService,
    private walletSvc:   WalletService,
  ) {}

  ngOnInit(): void {
    this.walletSvc.getBalance().subscribe({
      next: (r) => { this.walletBalance = r.data?.balance ?? 0; },
    });

    // Fetch up to 100 to capture all unique peers
    this.txnService.getAll({ size: 100 }).subscribe({
      next: (res) => {
        this.peers   = this.buildPeers(res.data ?? []);
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  // ── Build peer list grouped by counterparty.userId ───────────
  private buildPeers(txns: Transaction[]): ChatPeer[] {
    const map = new Map<number, ChatPeer>();

    for (const t of txns) {
      if (!t.counterparty || (t.type !== 'SEND' && t.type !== 'RECEIVE')) continue;

      const uid = t.counterparty.userId;

      if (!map.has(uid)) {
        map.set(uid, {
          userId:        uid,
          fullName:      t.counterparty.fullName,
          email:         t.counterparty.email,
          initials:      this.makeInitials(t.counterparty.fullName),
          lastAmount:    t.amount,
          lastType:      t.type,
          lastNote:      t.note ?? '',
          lastCreatedAt: t.createdAt,
          transactions:  [],
        });
      }
      map.get(uid)!.transactions.push(t);
    }

    const peers: ChatPeer[] = [];
    map.forEach(peer => {
      // Sort each peer's messages newest-first
      peer.transactions.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      const last           = peer.transactions[0];
      peer.lastAmount      = last.amount;
      peer.lastType        = last.type;
      peer.lastNote        = last.note ?? '';
      peer.lastCreatedAt   = last.createdAt;
      peers.push(peer);
    });

    // Sort peers: most-recent first
    return peers.sort((a, b) =>
      new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
    );
  }

  // ── Filtered list for search ──────────────────────────────────
  get filteredPeers(): ChatPeer[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.peers;
    return this.peers.filter(p =>
      p.fullName.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  }

  // ── Chat open/close ───────────────────────────────────────────
  openChat(peer: ChatPeer): void {
    this.activePeer  = peer;
    this.selectedTxn = null;
    this.resetSend();
  }

  closeChat(): void {
    this.activePeer  = null;
    this.selectedTxn = null;
    this.resetSend();
  }

  // ── Send steps ────────────────────────────────────────────────
  startSend(): void {
    this.sendStep  = 'form';
    this.sendError = '';
  }

  goToPin(): void {
    const amt = parseFloat(this.sendAmount);
    if (!amt || amt <= 0) { this.sendError = 'Enter a valid amount.'; return; }
    if (amt > this.walletBalance) { this.sendError = 'Insufficient wallet balance.'; return; }
    this.sendError = '';
    this.sendStep  = 'pin';
  }

  confirmSend(): void {
    if (!this.pin || this.pin.length < 4) {
      this.sendError = 'Enter your 4–6 digit transaction PIN.';
      return;
    }
    this.sending   = true;
    this.sendError = '';

    this.sendService.send({
      receiverEmailOrPhone: this.activePeer!.email,
      amount: parseFloat(this.sendAmount),
      note:   this.sendNote,
      pin:    this.pin,
    }).subscribe({
      next: () => {
        this.sending        = false;
        this.sendStep       = 'success';
        this.walletBalance -= parseFloat(this.sendAmount);
      },
      error: (err) => {
        this.sending   = false;
        this.sendError = err?.error?.message ?? 'Transfer failed. Try again.';
        this.sendStep  = 'error';
      },
    });
  }

  resetSend(): void {
    this.sendStep   = 'idle';
    this.sendAmount = '';
    this.sendNote   = '';
    this.pin        = '';
    this.showPin    = false;
    this.sendError  = '';
    this.sending    = false;
  }

  // ── Detail sheet ──────────────────────────────────────────────
  openTxn(t: Transaction): void  { this.selectedTxn = t; }
  closeTxn(): void               { this.selectedTxn = null; }

  // ── Helpers ───────────────────────────────────────────────────
  makeInitials(name: string): string {
    const p = name.trim().split(' ').filter(Boolean);
    return p.length >= 2 ? (p[0][0] + p[1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
  }

  avatarColor(name: string): string {
    const c = ['#4f8ef7','#7c3aed','#22c55e','#f97316','#ec4899','#14b8a6','#f59e0b','#6366f1'];
    let h = 0;
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
  }

  isSent(t: Transaction): boolean { return t.type === 'SEND'; }

  bubbleClass(t: Transaction): string {
    return t.type === 'SEND' ? 'bubble sent' : 'bubble recv';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatLastTime(iso: string): string {
    const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (diff === 0) return this.formatTime(iso);
    if (diff === 1) return 'Yesterday';
    if (diff < 7)  return new Date(iso).toLocaleDateString('en-IN', { weekday: 'short' });
    return this.formatDate(iso);
  }

  showDateSep(txns: Transaction[], i: number): boolean {
    if (i === 0) return true;
    return this.formatDate(txns[i].createdAt) !== this.formatDate(txns[i - 1].createdAt);
  }

  statusIcon(s: string): string {
    return ({ SUCCESS: '✓✓', PENDING: '⏳', FAILED: '✕', CANCELLED: '✕' } as any)[s] ?? '';
  }

  statusColor(s: string): string {
    return ({ SUCCESS: '#4ade80', PENDING: '#facc15', FAILED: '#f87171', CANCELLED: '#f87171' } as any)[s] ?? '#6b7280';
  }

  statusPillClass(s: string): string {
    return ({ SUCCESS: 'success', PENDING: 'pending', FAILED: 'failed', CANCELLED: 'failed' } as any)[s] ?? '';
  }
}