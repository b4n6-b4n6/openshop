import createSingleCached from './createSingleCached.js';
import readMyOnionHostname from '../../utils/readMyOnionHostname.js';

export default createSingleCached(readMyOnionHostname);
