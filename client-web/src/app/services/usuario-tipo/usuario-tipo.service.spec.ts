import { TestBed } from '@angular/core/testing';

import { UsuarioTipoService } from './usuario-tipo.service';

describe('UsuarioTipoService', () => {
  let service: UsuarioTipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioTipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
