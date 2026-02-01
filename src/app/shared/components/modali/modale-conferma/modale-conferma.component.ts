import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-modale-conferma',
	imports: [CommonModule, FormsModule, NgbModule],
	templateUrl: './modale-conferma.component.html',
})
export class ModaleConfermaComponent implements OnInit {
	constructor(public modal: NgbActiveModal) {}

	title = 'Warning';
	message = 'Message';
	button = 'Delete';
	close = 'Cancel';
	buttonClass = 'btn-save';

	ngOnInit() {}
}

/**
 * Opens a confirmation modal dialog using the NgbModal service.
 *
 * @param modalService - The NgbModal service used to open the modal.
 * @param message - The message to display in the modal.
 * @param button - The label for the confirmation button.
 * @param buttonClass - The CSS class for the confirmation button (default: 'btn-save').
 * @param close - The label for the close button (default: 'Annulla').
 * @param backdrop - The backdrop option for the modal (default: undefined).
 * @param title - The title of the modal (default: 'Avviso').
 * @returns A Promise that resolves to true if the confirmation button is clicked, or false if the modal is closed without confirmation.
 */
export function modaleConferma(
	modalService: NgbModal,
	title: string,
	message: string,
	button: string,
	buttonClass = 'btn-save',
	close = 'Annulla',
	backdrop: 'static' | undefined = undefined,
): Promise<boolean> {
	const modal = modalService.open(ModaleConfermaComponent, {
		size: 'md',
		windowClass: 'confirm-modal',
		backdropClass: 'modal-confirm-backdrop',
		backdrop,
	});
	modal.componentInstance.message = message;
	modal.componentInstance.button = button;
	modal.componentInstance.close = close;
	modal.componentInstance.title = title;
	modal.componentInstance.buttonClass = buttonClass;
	return modal.result;
}
