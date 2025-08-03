import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { UsersComponent } from './pages/users/users.component';
import { roleGuard } from './guards/role.guard';
import { RoleComponent } from './pages/role/role.component';
import { ForgetPasswordComponent } from './pages/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { ProvidersComponent } from './pages/providers/providers.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { ProductsComponent } from './pages/products/products.component';
import { PurchasesComponent } from './pages/purchases/purchases.component';
import { FaqsComponent } from './pages/faqs/faqs.component';
import { FaqsAdminComponent } from './pages/faqs-admin/faqs-admin.component';
import { CustomerReviewsAdminComponent } from './pages/customer-reviews-admin/customer-reviews-admin.component';
import { CustomerReviewsComponent } from './pages/customer-reviews/customer-reviews.component';
import { SalesAdminComponent } from './pages/sales-admin/sales-admin.component';
import { MyPurchasesComponent } from './pages/my-purchases/my-purchases.component';
import { QuotationFormComponent } from './components/quotation-form/quotation-form.component';
import { QuotationsAdminComponent } from './components/quotation-admin/quotation-admin.component';  



export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'account/:id',
    component: AccountComponent,
    canActivate: [authGuard],
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'roles',
    component: RoleComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'providers',
    component: ProvidersComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'Manuales',
    component: DocumentsComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin', 'Cliente'],
    },
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'purchases',
    component: PurchasesComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
    path: 'faqs',
    component: FaqsComponent,
  },
  {
    path: 'faqs-admin',
    component: FaqsAdminComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
  path: 'customer-reviews-admin',
  component: CustomerReviewsAdminComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['Admin'],
  },
},
{
  path: 'customer-reviews',
  component: CustomerReviewsComponent,
  canActivate: [roleGuard],
  data: {
    roles: ['Cliente'],
  },
},
{
    path: 'my-purchases',
    component: MyPurchasesComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Cliente'],
    },
  },
  {
    path: 'sales-admin',
    component: SalesAdminComponent,
    canActivate: [roleGuard],
    data: {
      roles: ['Admin'],
    },
  },
  {
  path: 'quotations',
  component: QuotationFormComponent,
  canActivate: [authGuard],
  data: { roles: ['Cliente'] }
},
{
  path: 'quotations-admin',
  component: QuotationsAdminComponent,
  canActivate: [authGuard],
  data: { roles: ['Admin'] }
}
 
];