import { Map } from 'immutable';

const providers = new Map({
  zaif: {
    id: 'zaif',
    name: 'Zaif',
    oauth: true,
    csv: true,
  },
  bitFlyer: {
    id: 'bitFlyer',
    name: 'BitFlyer',
    api: true,
    csv: true,
  },
});

export default providers;

export function getProviderName(id) {
  return providers.get(id).name;
}
