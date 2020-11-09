import { IntegerUtils } from '../transformation/IntegerUtils';
import { QueryResult } from 'neo4j-driver';

/**
 * JsonParser For Neo4j
 *
 * @export
 * @class JsonParser
 */
export class JsonParser {
  /**
   * Parse the neo4j query result
   *
   * @static
   * @param {QueryResult} neo4jResult
   * @return {*}  {*}
   * @memberof JsonParser
   */
  public static parse(neo4jResult: QueryResult): any {
    try {
      return JsonParser.parseNeo4jResponse(neo4jResult);
    } catch (error) {
      throw new Error(`Parse error: ${error.message}`);
    }
  }

  private static *keyValues(obj: {}) {
    for (const key of Object.keys(obj)) {
      yield [key, obj[key as keyof {}]];
    }
  }

  private static *enumerate(array: any[]) {
    let index = 0;
    for (const element of array) {
      yield [index, element];
      index++;
    }
  }

  private static hasProperties(obj: any): boolean {
    return obj.properties && obj.identity && typeof obj.identity.low === 'number';
  }

  /**
   * Parse individual record
   *
   * @static
   * @param {*} record
   * @return {*}  {*}
   * @memberof JsonParser
   */
  public static parseRecord(record: any): any {
    // If undefined or value
    if (!record || typeof record !== 'object') {
      return record;
    } else if (Object.keys(record).length === 2 && typeof record.low === 'number' && typeof record.high === 'number') {
      // If it's a number
      if ((record.high === 0 && record.low >= 0) || (record.high === -1 && record.low < 0)) {
        return record.low;
      } else {
        return IntegerUtils.to64BitsIntegerString(record.high, record.low);
      }
    } else if (typeof record['0'] !== 'undefined') {
      // If it's an array
      const result: any[] = [];
      let index = 0;
      let current = record['0'];
      while (typeof current !== 'undefined') {
        result.push(JsonParser.parseRecord(current));
        index++;
        current = record[String(index)];
      }
      return result;
    } else {
      // It's an object by this point
      const properties = JsonParser.hasProperties(record) ? record.properties : record;
      if (!record.identity && Object.keys(properties).length === 0) {
        return [];
      }
      const result = {} as any;
      if (record.identity) {
        result.id = JsonParser.parseRecord(record.identity);
      }
      for (let [key, value] of JsonParser.keyValues(properties)) {
        value = JsonParser.parseRecord(value);
        result[key] = value;
      }
      return result;
    }
  }

  private static parseNeo4jResponse(response: QueryResult): any {
    const result = [] as any;
    for (const record of response.records) {
      if (record.length === 1) {
        result.push(JsonParser.parseRecord((record as any)._fields[0]));
      } else {
        const parsedRecord = {} as any;
        for (const [index, key] of JsonParser.enumerate(record.keys)) {
          parsedRecord[key] = JsonParser.parseRecord((record as any)._fields[index]);
        }
        result.push(parsedRecord);
      }
    }
    return result;
  }
}
