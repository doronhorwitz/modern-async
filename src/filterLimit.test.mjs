
import { expect, test } from '@jest/globals'
import filterLimit from './filterLimit.mjs'
import _ from 'lodash'
import Deferred from './Deferred.mjs'

test('filterLimit base', async () => {
  const arr = _.range(6)
  const res = await filterLimit(arr, async (x) => x % 2 === 0, 2)
  expect(res).toEqual([0, 2, 4])
})

test('filterLimit no async', async () => {
  const arr = _.range(6)
  const res = await filterLimit(arr, (x) => x % 2 === 0, 2)
  expect(res).toEqual([0, 2, 4])
})

test('filterLimit concurrency', async () => {
  const arr = _.range(6)
  const called = {}
  arr.forEach((v) => { called[v] = 0 })
  const d = new Deferred()
  const p = filterLimit(arr, async (x) => {
    called[x] += 1
    await d.promise
    return x % 2 === 0
  }, 2)
  expect(called[0]).toBe(1)
  expect(called[1]).toBe(1)
  expect(called[2]).toBe(0)
  expect(called[3]).toBe(0)
  expect(called[4]).toBe(0)
  expect(called[5]).toBe(0)
  d.resolve()
  const res = await p
  expect(res).toEqual([0, 2, 4])
  expect(called[0]).toBe(1)
  expect(called[1]).toBe(1)
  expect(called[2]).toBe(1)
  expect(called[3]).toBe(1)
  expect(called[4]).toBe(1)
  expect(called[5]).toBe(1)
})
