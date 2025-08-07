import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private openModalSubject = new Subject<void>();

  openModal(): void {
    this.openModalSubject.next();
  }

  onOpenModal(): Observable<void> {
    return this.openModalSubject.asObservable();
  }
}
