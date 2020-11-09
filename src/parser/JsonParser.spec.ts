import { Record } from 'neo4j-driver';
import { JsonParser } from './JsonParser';

describe('Test JsonParser', () => {
  let fakeResultSummary, fakeRecord;

  beforeEach(() => {
    fakeResultSummary = {
      records: [],
      summary: jest.fn().mockReturnValue(true)
    };
  });

  fakeRecord = {
    _fields: [{ properties: {}, identity: { low: 0, high: 15 } }],
    keys: ['test']
  };

  test('Parse empty records', async () => {
    const parsed = JsonParser.parse(fakeResultSummary);
    expect(parsed).toEqual([]);
  });

  test('Parse', () => {
    fakeResultSummary.records.push(fakeRecord);

    const parsed = (JsonParser as any).parseNeo4jResponse(fakeResultSummary);
    expect(parsed).toEqual([{ test: { id: '64424509440' } }]);
  });

  test('Parse array one record', () => {
    fakeRecord.length = 1;
    fakeResultSummary.records.push(fakeRecord);

    const parsed = (JsonParser as any).parseNeo4jResponse(fakeResultSummary);
    expect(parsed).toEqual([{ id: '64424509440' }]);
  });

  test('Parse with err', async () => {
    const parseNeo4jResponseSpy = jest.spyOn(JsonParser as any, 'parseNeo4jResponse').mockImplementation(() => {
      throw new Error('fails');
    });
    let fails = false;
    try {
      JsonParser.parse(fakeResultSummary);
    } catch (error) {
      fails = true;
    }
    parseNeo4jResponseSpy.mockRestore();
    expect(fails).toBeTruthy();
  });

  test('keyValues', async () => {
    const obj = { testName: 'test' };
    const keyValue = (JsonParser as any).keyValues(obj);
    expect(keyValue.next()).toEqual({ done: false, value: ['testName', 'test'] });
  });

  test('enumerate', async () => {
    const arr = ['test', 'test1'];
    const keyValue = (JsonParser as any).enumerate(arr);
    let val = keyValue.next();
    val = keyValue.next();
    expect(val).toEqual({ done: false, value: [1, 'test1'] });
  });

  test('hasProperties', async () => {
    const obj = { properties: true, identity: { low: 12 } };
    const hasProps = (JsonParser as any).hasProperties(obj);
    expect(hasProps).toBeTruthy();
  });

  test('parseRecord is undefined', async () => {
    expect(JsonParser.parseRecord(undefined)).toBeUndefined();
  });

  test('parseRecord is object', async () => {
    const obj = { properties: {}, identity: { low: 0, high: 15 } };
    const parsed = JsonParser.parseRecord(obj);
    expect(parsed).toEqual({ id: '64424509440' });
  });

  test('parseRecord is object without identity', async () => {
    const obj = { properties: {} };
    const parsed = JsonParser.parseRecord(obj);
    expect(parsed).toEqual({ properties: [] });
  });

  test('parseRecord low only', async () => {
    const obj = { properties: true, identity: { low: 1, high: 0 } };
    const parsed = JsonParser.parseRecord(obj);
    expect(parsed).toEqual({ id: 1 });
  });

  test('parseRecord negatives only', async () => {
    const obj = { properties: true, identity: { low: -1, high: -1 } };
    const parsed = JsonParser.parseRecord(obj);
    expect(parsed).toEqual({ id: -1 });
  });

  test('parseRecord array', async () => {
    const obj = [{ properties: true, identity: { low: -1, high: -1 } }];
    const parsed = JsonParser.parseRecord(obj);
    expect(parsed).toEqual([{ id: -1 }]);
  });
});
