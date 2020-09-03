import { TestBed } from '@angular/core/testing';

import { FormatoService } from './formato.service';

describe('FormatoService', () => {
  let service: FormatoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormatoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
