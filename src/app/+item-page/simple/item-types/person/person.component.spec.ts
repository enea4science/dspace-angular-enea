import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { createRelationshipsObservable, getItemPageFieldsTest } from '../shared/item.component.spec';
import { PersonComponent } from './person.component';
import { of as observableOf } from 'rxjs';
import { createSuccessfulRemoteDataObject$ } from '../../../../shared/testing/utils';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: createSuccessfulRemoteDataObject$(new PaginatedList(new PageInfo(), [])),
  metadata: {
    'person.identifier.email': [
      {
        language: 'en_US',
        value: 'fake@email.com'
      }
    ],
    'person.identifier.orcid': [
      {
        language: 'en_US',
        value: 'ORCID-1'
      }
    ],
    'person.identifier.birthdate': [
      {
        language: 'en_US',
        value: '1993'
      }
    ],
    'person.identifier.staffid': [
      {
        language: 'en_US',
        value: '1'
      }
    ],
    'person.identifier.jobtitle': [
      {
        language: 'en_US',
        value: 'Developer'
      }
    ],
    'person.identifier.lastname': [
      {
        language: 'en_US',
        value: 'Doe'
      }
    ],
    'person.identifier.firstname': [
      {
        language: 'en_US',
        value: 'John'
      }
    ]
  },
  relationships: createRelationshipsObservable()
});

describe('PersonComponent', getItemPageFieldsTest(mockItem, PersonComponent));
