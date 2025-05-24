import { TestBed } from '@angular/core/testing';

import { ListaServiceService } from './lista-service.service';

describe('ListaServiceService', () => {
  let service: ListaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
