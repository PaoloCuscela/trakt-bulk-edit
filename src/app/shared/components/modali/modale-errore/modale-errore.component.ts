import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConfigService } from '../../../services/config.service';

@Component({
	selector: 'ma-modale-avviso',
	imports: [CommonModule, FormsModule, NgbModule, NgSelectModule],
	templateUrl: './modale-errore.component.html',
})
export class ModaleErroreComponent implements OnInit {
	title = 'Warning';
	message = 'Message';
	close = 'Cancel';
	erroreHttp?: HttpErrorResponse;
	hrefInvioMail = '';

	constructor(
		public modal: NgbActiveModal,
		private config: ConfigService,
	) {}

	ngOnInit() {}
}

/**
 *
 * @param modalService
 * @param message
 * @param erroreHttp
 * @returns
 */
export function modaleErrore(
	modalService: NgbModal,
	title: string,
	message: string,
	erroreHttp?: HttpErrorResponse,
	close: string = 'Annulla',
): Promise<boolean> {
	const modal = modalService.open(ModaleErroreComponent, { size: 'md' });
	modal.componentInstance.title = title;
	modal.componentInstance.message = message;
	modal.componentInstance.erroreHttp = erroreHttp;
	modal.componentInstance.close = close;
	modal.componentInstance.setHrefInvioMail();
	return modal.result;
}
