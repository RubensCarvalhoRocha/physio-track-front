import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { UserService } from 'app/core/user/user.service';

@Injectable({ providedIn: 'root' })
export class PacienteGuard implements CanActivate {
    usuario: any;
    constructor(private _userService: UserService, private router: Router) {
        this._userService.user$.subscribe((user) => {
            this.usuario = user;
            console.log('Usuário retornado pelo UserService:', this.usuario);
        });
    }

    canActivate(): boolean | UrlTree {
        console.log('guard esta sendo chamado');
        console.log(`CurrentUser retorando:`, this.usuario);

        // se for paciente → NÃO pode acessar essas rotas
        if (this.usuario?.tipoUsuario === 'Paciente') {
            return this.router.parseUrl(
                `/atendimento/paciente/${this.usuario.id}`
            );
        }

        return true;
    }
}
