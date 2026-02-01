import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-public',
    imports: [RouterOutlet],
    template: `<router-outlet></router-outlet>`,
    styles: ``
})
export class PublicComponent {}
