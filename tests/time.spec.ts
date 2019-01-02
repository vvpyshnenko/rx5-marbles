import { TestScheduler } from 'rxjs/testing/TestScheduler';
import { interval } from 'rxjs/observable/interval';
import { of } from 'rxjs/observable/of';
import { delay, filter, map, take } from 'rxjs/operators';


it('interval', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const result$ = interval(10, scheduler).pipe(
    take(10),
    filter(x => x % 2 === 0),
  );
  const expectedMarble = '-a-b-c-d-e|';
  const expectedValues = { a: 0, b: 2, c: 4, d: 6, e: 8 };
  scheduler.expectObservable(result$).toBe(expectedMarble, expectedValues);
  scheduler.flush();
})

it('delay', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const result$ = of('a').pipe(
    delay(20, scheduler),
  );
  const expectedMarble = '--(a|)';
  scheduler.expectObservable(result$).toBe(expectedMarble);
  scheduler.flush();
})
