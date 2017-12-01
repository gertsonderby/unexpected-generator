import unexpected from 'unexpected';
import unexpectedGenerator from './unexpectedGenerator';

global.expect = unexpected.clone().use(unexpectedGenerator);
