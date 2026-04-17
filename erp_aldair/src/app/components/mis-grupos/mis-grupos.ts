import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-mis-grupos',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './mis-grupos.html'
})
export class MisGruposComponent implements OnInit {
  misGrupos: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.cargarMisGrupos();
  }

  private getHeaders() {
    const token = document.cookie.split('; ').find(row => row.startsWith('erp_token='))?.split('=')[1];
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  cargarMisGrupos() {
    this.http.get<any>('http://localhost:3000/api/groups', { headers: this.getHeaders() }).subscribe({
      next: (res) => {
        // Filtrar solo los grupos en los que el usuario logueado está asignado
        const emailUsuario = this.auth.usuarioActual?.email;
        if (emailUsuario) {
          // Un empleado está en el grupo si su correo está en el arreglo 'empleados'
          this.misGrupos = res.data.filter((grupo: any) => 
            grupo.empleados && grupo.empleados.includes(emailUsuario)
          );
        } else {
          this.misGrupos = [];
        }
      },
      error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar tus grupos' })
    });
  }

  accederAGrupo(grupo: any) {
    localStorage.setItem('erp_current_group', grupo.id.toString());
    localStorage.setItem('erp_current_group_name', grupo.nombre);
    this.auth.setPermisosGrupo(grupo.id.toString());
    this.router.navigate(['/vista-grupo']);
  }
}
