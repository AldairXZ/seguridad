import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  const token = document.cookie.split('; ').find(row => row.startsWith('erp_token='))?.split('=')[1];
  const groupId = localStorage.getItem('erp_current_group');

  let clonedReq = req;
  if (token) {
    let headers = req.headers.set('Authorization', `Bearer ${token}`);
    if (groupId) {
      headers = headers.set('x-group-id', groupId);
    }
    clonedReq = req.clone({ headers });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // - rate limiting
      if (error.status === 429) {
        messageService.add({ 
          severity: 'error', 
          summary: 'Demasiadas Peticiones', 
          detail: 'Por favor, espera un momento antes de realizar otra acción. (Rate Limit Excedido)' 
        });
      }
      return throwError(() => error);
    })
  );
};
