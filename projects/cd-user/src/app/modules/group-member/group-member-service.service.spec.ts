import { TestBed } from '@angular/core/testing';

import { GroupMemberServiceService } from './group-member-service.service';

describe('GroupMemberServiceService', () => {
  let service: GroupMemberServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupMemberServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
