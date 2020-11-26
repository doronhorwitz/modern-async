
import Queue from './Queue'

/**
 * A class representing a mutex. It allows to run tasks in mutual exclusion, which
 * means only one task can be executed at a time. It is basically a Queue with a
 * concurrency of 1.
 */
export default class Mutex {
  /**
   * Constructs a Mutex.
   */
  constructor () {
    this._queue = new Queue(1)
  }

  /**
   * @returns {boolean} Whether or not there is actually a task running.
   */
  get locked () {
    return this._queue.running >= 1
  }

  /**
   * @returns {number} The number of pending tasks.
   */
  get pending () {
    return this._queue.pending
  }

  /**
   * Puts a task at the end of the queue. When the task is executed and completes the returned promise will be updated
   * accordingly.
   *
   * @param {Function} fct An asynchronous functions representing the task. It will be executed when the queue has
   * available slots and its result will be propagated to the promise returned by exec().
   * @returns {Promise} A promise that will be resolved once the task has completed.
   */
  async exec (fct) {
    return this._queue.exec(fct)
  }
}
