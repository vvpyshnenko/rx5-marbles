import { Observable } from 'rxjs/Observable';
import { TestScheduler } from 'rxjs/testing/TestScheduler';
import { concatMap, map, mapTo, mergeMap, switchMap } from 'rxjs/operators';

it('test map function with TestScheduler', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const source$: Observable<number> = scheduler.createColdObservable('--a--b--c|', { a: 5, b: 10, c: 15 });
  const expectedMarble = '--x--y--z|';
  const expectedValues = { x: 10, y: 20, z: 30 };
  const result$ = source$.pipe(map((x: number) => x * 2));
  scheduler.expectObservable(result$).toBe(expectedMarble, expectedValues);
  scheduler.flush();
})

it('should map every value emitted to "surprise!', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const values = { a: 1, b: 2, c: 3, x: 'surprise!' };
  const source$: Observable<number> = scheduler.createColdObservable('-a-b-c-|', values);
  const expectedMarble = '-x-x-x-|';
  const result$ = source$.pipe(mapTo('surprise!'));
  scheduler.expectObservable(result$).toBe(expectedMarble, values);
  scheduler.flush();
})

it('mergeMap', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const values = { a: 'hello', b: 'world', x: 'hello world' };
  const obs1: Observable<string> = scheduler.createColdObservable('-a-------a--|', values);
  const obs2: Observable<string> = scheduler.createColdObservable('-b-b-b-|', values);
  const expectedMarble = '--x-x-x---x-x-x-|';
  const result$ = obs1.pipe(mergeMap(x => obs2.pipe(map(y => x + ' ' + y))));
  scheduler.expectObservable(result$).toBe(expectedMarble, values);
  scheduler.flush();
})

it('swithMap', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const values = { a: 10, b: 30, x: 20, y: 40 };
  const obs1: Observable<number> = scheduler.createColdObservable('-a-----a--b-|', values);
  const obs2: Observable<number> = scheduler.createColdObservable('a-a-a|', values);
  const expectedMarble = '-x-x-x-x-xy-y-y|';
  const result$ = obs1.pipe(switchMap(x => obs2.pipe(map(y => x + y))));
  scheduler.expectObservable(result$).toBe(expectedMarble, values);
  scheduler.flush();
})

it('concatMap', () => {
  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
  const values = { a: 10, b: 30, x: 20, y: 40 };
  const obs1: Observable<number> = scheduler.createColdObservable('-a--------b------ab|', values);
  const obs2: Observable<number> = scheduler.createColdObservable('a-a-a|', values);
  const expectedMarble = '-x-x-x----y-y-y--x-x-xy-y-y|';
  const result$ = obs1.pipe(concatMap(x => obs2.pipe(map(y => x + y))));
  scheduler.expectObservable(result$).toBe(expectedMarble, values);
  scheduler.flush();
})
