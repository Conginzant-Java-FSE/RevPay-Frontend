import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { SplitService } from '../../core/services/split.service';
import { WalletService } from '../../core/services/wallet.service';
import { TokenService } from '../../core/services/token.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-split-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  template: `
    <div class="page-layout">
      <div class="header">
        <h1>Split & Group Payments</h1>
        <p>Fair share, no stress. Divide expenses with friends and family instantly.</p>
      </div>

      <div class="tabs">
        <button [class.active]="activeTab === 'create'" (click)="activeTab = 'create'">
          <mat-icon>add_circle_outline</mat-icon> Create Split
        </button>
        <button [class.active]="activeTab === 'owed'" (click)="activeTab = 'owed'">
          <mat-icon>account_balance_wallet</mat-icon> Money Owed
          <span class="badge" *ngIf="owedSplits.length > 0">{{ owedSplits.length }}</span>
        </button>
        <button [class.active]="activeTab === 'my'" (click)="activeTab = 'my'">
          <mat-icon>history</mat-icon> My Splits
        </button>
      </div>

      <div class="content-area">
        <!-- CREATE SPLIT TAB -->
        <div *ngIf="activeTab === 'create'" class="tab-pane fade-in">
          <form [formGroup]="createForm" (ngSubmit)="onCreateSplit()" class="glass-card">
            <div class="form-grid">
              <div class="form-group full-width">
                <label>What's it for?</label>
                <input type="text" formControlName="note" placeholder="e.g. Dinner at Marriott, Weekend Trip">
              </div>
              <div class="form-group">
                <label>Total Amount (₹)</label>
                <input type="number" formControlName="totalAmount" placeholder="0.00">
              </div>
              <div class="form-group">
                <label>Your Transaction PIN</label>
                <input type="password" formControlName="pin" placeholder="••••" maxlength="6">
              </div>
            </div>

            <div class="participants-section">
              <div class="section-header">
                <h3>Participants</h3>
                <button type="button" class="btn-secondary btn-sm" (click)="addParticipant()">
                  <mat-icon>person_add</mat-icon> Add
                </button>
              </div>

              <div formArrayName="participants" class="participants-list">
                <div *ngFor="let p of participants.controls; let i = index" [formGroupName]="i" class="participant-row">
                  <input type="text" formControlName="emailOrPhone" placeholder="Email or Phone">
                  <input type="number" formControlName="amount" placeholder="₹ 0.00">
                  <button type="button" class="btn-icon btn-danger" (click)="removeParticipant(i)" *ngIf="participants.length > 1">
                    <mat-icon>delete_outline</mat-icon>
                  </button>
                </div>
              </div>
            </div>

            <div class="actions">
              <button type="submit" class="btn-primary" [disabled]="createForm.invalid || loading">
                {{ loading ? 'Creating...' : 'Create Split' }}
              </button>
            </div>
          </form>
        </div>

        <!-- MONEY OWED TAB -->
        <div *ngIf="activeTab === 'owed'" class="tab-pane fade-in">
          <div *ngIf="owedSplits.length === 0" class="empty-state">
            <mat-icon>done_all</mat-icon>
            <p>You're all settled! No pending payments.</p>
          </div>
          <div class="splits-grid">
            <div *ngFor="let split of owedSplits" class="glass-card split-card">
              <div class="card-header">
                <span class="created-by">By {{ split.createdByName }}</span>
                <span class="date">{{ split.createdAt | date:'shortDate' }}</span>
              </div>
              <h3>{{ split.note }}</h3>
              <div class="amount-box">
                <span class="label">You owe</span>
                <span class="value">₹{{ getMyOwedAmount(split) }}</span>
              </div>
              <div class="card-footer">
                <button class="btn-primary btn-full" (click)="openPayModal(split)">Pay Now</button>
              </div>
            </div>
          </div>
        </div>

        <!-- MY SPLITS TAB -->
        <div *ngIf="activeTab === 'my'" class="tab-pane fade-in">
          <div *ngIf="mySplits.length === 0" class="empty-state">
            <mat-icon>history</mat-icon>
            <p>No splits created by you yet.</p>
          </div>
          <div class="splits-grid">
            <div *ngFor="let split of mySplits" class="glass-card split-card">
              <div class="card-header">
                <span class="status-badge" [class.settled]="split.status === 'SETTLED'">{{ split.status }}</span>
                <span class="date">{{ split.createdAt | date:'shortDate' }}</span>
              </div>
              <h3>{{ split.note }}</h3>
              <div class="amount-info">
                <span>Total: ₹{{ split.totalAmount }}</span>
                <span>{{ split.participants.length }} people</span>
              </div>
              <div class="participant-stats">
                <div *ngFor="let p of split.participants" class="p-stat" [class.paid]="p.paid">
                  <span class="p-name">{{ p.fullName }}</span>
                  <span class="p-status">
                    <mat-icon>{{ p.paid ? 'check_circle' : 'pending' }}</mat-icon>
                    ₹{{ p.amountOwed }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TRANSACTION PIN MODAL -->
      <div class="modal-overlay" *ngIf="showPayModal" (click)="closePayModal()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <h3>Secure Payment</h3>
          <p>Confirming payment of <strong>₹{{ getMyOwedAmount(selectedSplit) }}</strong> for "{{ selectedSplit?.note }}"</p>
          
          <div class="form-group">
            <label>Enter Transaction PIN</label>
            <input type="password" [(ngModel)]="repayPin" placeholder="••••" maxlength="6" class="pin-input">
          </div>

          <div class="modal-actions">
            <button class="btn-text" (click)="closePayModal()">Cancel</button>
            <button class="btn-primary" (click)="confirmPay()" [disabled]="!repayPin || loading">
              {{ loading ? 'Processing...' : 'Confirm' }}
            </button>
          </div>
        </div>
      </div>

      <!-- FEEDBACK MESSAGES -->
      <div class="toast error" *ngIf="error">{{ error }}</div>
      <div class="toast success" *ngIf="success">{{ success }}</div>
    </div>
  `,
  styles: [`
    .page-layout {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
      min-height: 100vh;
      color: #fff;
    }

    .header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.5rem;
    }

    .header p {
      color: #94a3b8;
      font-size: 1.1rem;
    }

    .tabs {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      background: rgba(255, 255, 255, 0.05);
      padding: 0.5rem;
      border-radius: 1rem;
      backdrop-filter: blur(10px);
    }

    .tabs button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.8rem;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0.8rem;
      transition: all 0.3s ease;
      position: relative;
    }

    .tabs button.active {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }

    .badge {
      background: #ef4444;
      color: white;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 1rem;
      margin-left: 0.5rem;
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .full-width { grid-column: span 2; }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      color: #94a3b8;
      margin-left: 0.2rem;
    }

    input {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.8rem 1rem;
      border-radius: 0.8rem;
      color: #fff;
      font-size: 1rem;
      transition: all 0.3s ease;
    }

    input:focus {
      outline: none;
      border-color: #4facfe;
      background: rgba(255, 255, 255, 0.08);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .participant-row {
      display: grid;
      grid-template-columns: 1fr auto auto;
      gap: 1rem;
      margin-bottom: 1rem;
      animation: slideIn 0.3s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: #fff;
      border: none;
      padding: 1rem 2rem;
      border-radius: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(79, 172, 254, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: #fff;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .btn-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: none;
      padding: 0.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
    }

    .splits-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .split-card {
      padding: 1.5rem;
      transition: transform 0.3s ease;
    }

    .split-card:hover { transform: translateY(-5px); }

    .card-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.8rem;
      color: #94a3b8;
    }

    .amount-box {
      background: rgba(79, 172, 254, 0.1);
      border-radius: 1rem;
      padding: 1rem;
      text-align: center;
      margin: 1rem 0;
    }

    .amount-box .label {
      display: block;
      font-size: 0.8rem;
      color: #4facfe;
    }

    .amount-box .value {
      font-size: 1.8rem;
      font-weight: 800;
      color: #fff;
    }

    .status-badge {
      background: #f59e0b;
      color: #fff;
      padding: 0.2rem 0.6rem;
      border-radius: 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
    }

    .status-badge.settled { background: #10b981; }

    .participant-stats {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .p-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .p-stat.paid { color: #10b981; }

    .p-status {
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }

    .p-status mat-icon { font-size: 1rem; width: 1rem; height: 1rem; }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #94a3b8;
    }

    .empty-state mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      margin-bottom: 1rem;
      opacity: 0.2;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(5px);
    }

    .modal-content {
      width: 100%;
      max-width: 400px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
    }

    .btn-text {
      background: transparent;
      border: none;
      color: #94a3b8;
      cursor: pointer;
      font-weight: 600;
    }

    .pin-input {
      text-align: center;
      font-size: 1.5rem;
      letter-spacing: 0.5rem;
    }

    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 1rem 2rem;
      border-radius: 1rem;
      color: #fff;
      z-index: 2000;
      animation: slideUp 0.3s ease;
    }

    .toast.error { background: #ef4444; }
    .toast.success { background: #10b981; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .fade-in { animation: fadeIn 0.5s ease; }
  `]

})
export class SplitPaymentComponent implements OnInit {

  private fb = inject(FormBuilder);
  private splitService = inject(SplitService);
  private walletService = inject(WalletService);

  // ✅ FIX: inject TokenService here instead of inside method
  private tokenService = inject(TokenService);

  activeTab: 'create' | 'owed' | 'my' = 'create';
  loading = false;
  error = '';
  success = '';
  mySplits: any[] = [];
  owedSplits: any[] = [];

  showPayModal = false;
  selectedSplit: any = null;
  repayPin = '';

  createForm: FormGroup = this.fb.group({
    totalAmount: [null, [Validators.required, Validators.min(1)]],
    note: ['', Validators.required],
    pin: ['', [Validators.required, Validators.pattern(/^[0-9]{4,6}$/)]],
    participants: this.fb.array([])
  });

  get participants() {
    return this.createForm.get('participants') as FormArray;
  }

  ngOnInit() {
    this.addParticipant();
    this.loadData();
  }

  loadData() {
    this.splitService.getMySplits().subscribe(res => this.mySplits = res);
    this.splitService.getOwedSplits().subscribe(res => this.owedSplits = res);
  }

  addParticipant() {
    this.participants.push(this.fb.group({
      emailOrPhone: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]]
    }));
  }

  removeParticipant(index: number) {
    this.participants.removeAt(index);
  }

  onCreateSplit() {
    if (this.createForm.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.splitService.createSplit(this.createForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Split created successfully!';
        this.createForm.reset();
        this.participants.clear();
        this.addParticipant();
        this.loadData();
        setTimeout(() => this.success = '', 5000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create split.';
      }
    });
  }

  // ✅ FIXED: removed inject() from method
  getMyOwedAmount(split: any): number {
    if (!split) return 0;

    const token = this.tokenService.getToken();
    if (!token) return 0;

    try {
      const payload: any = JSON.parse(atob(token.split('.')[1]));
      const myEmail = payload.sub;
      const me = split.participants.find((p: any) => p.emailOrPhone === myEmail);
      return me ? me.amountOwed : 0;
    } catch {
      return 0;
    }
  }

  openPayModal(split: any) {
    this.selectedSplit = split;
    this.showPayModal = true;
    this.repayPin = '';
    this.error = '';
  }

  closePayModal() {
    this.showPayModal = false;
    this.selectedSplit = null;
    this.repayPin = '';
  }

  confirmPay() {
    if (!this.repayPin || !this.selectedSplit) return;

    this.loading = true;
    this.error = '';

    this.splitService.payShare(this.selectedSplit.splitId, this.repayPin).subscribe({
      next: () => {
        this.loading = false;
        this.closePayModal();
        this.success = 'Payment successful!';
        this.loadData();
        setTimeout(() => this.success = '', 5000);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Payment failed.';
      }
    });
  }
}