import camelCase from 'camel-case';

export default [
  {
    id: camelCase('Zaif'),
    name: 'Zaif',
    oauth: true,
    csv: true,
  },
  {
    id: camelCase('BitFlyer'),
    name: 'BitFlyer',
    api: true,
    csv: true,
  },
];
