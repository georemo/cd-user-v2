import { TestBed } from '@angular/core/testing';

import { UserFrontService } from './user-front.service';

describe('UserServiceService', () => {
  let service: UserFrontService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFrontService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
