/*! angular-q-extras - v0.1.5 - 2015-12-22 */
(function () {
  'use strict';

  angular.module('angular-q-extras', ['ngLodash'])
    .constant('angularPromiseConstant', {
      FULFILLED: 'fulfilled',
      REJECTED: 'rejected'
    })
    .config(angularPromiseDecorator);

  angularPromiseDecorator.$inject = ['$provide', 'angularPromiseConstant', 'lodash'];

  /**
   * From documentation:
   *
   * The <code>$q.all</code> function returns a promise for an array of values.
   * When this promise is fulfilled, the array contains the fulfillment values
   * of the original promises, in the same order as those promises.
   * If one of the given promises is rejected, the returned promise is immediately rejected,
   * not waiting for the rest of the batch.
   * If you want to wait for all of the promises to either be fulfilled or rejected,
   * you can use <code>$q.allSettled</code>.
   *
   * See also:
   * https://github.com/kriskowal/q/wiki/API-Reference#promiseallsettled
   */
  function angularPromiseDecorator($provide, PROMISE, _) {

    $provide.decorator('$q', ['$delegate', function ($delegate) {
      var $q = $delegate;

      var validatePromiseState = function (promise, State) {
        return _.has(promise, 'state') && promise.state === State;
      };

      /**
       * @name $q#isFulfilledState
       * @kind function
       *
       * @description
       * Verify if state is 'fulfilled'.
       *
       * @param {Object.<Promise>}
       * @returns {Boolean}
       */
      var isFulfilledState = function (promise) {
        return validatePromiseState(promise, PROMISE.FULFILLED);
      };

      /**
       * @name $q#isRejectedState
       * @kind function
       *
       * @description
       * Verify if state is 'rejected'.
       *
       * @param {Object.<Promise>}
       * @returns {Boolean}
       */
      var isRejectedState = function (promise) {
        return validatePromiseState(promise, PROMISE.REJECTED);
      };

      var settle = function (promise) {
        return $q.when(promise).then(
          function (value) {
            return {state: PROMISE.FULFILLED, value: value};
          },
          function (reason) {
            return {state: PROMISE.REJECTED, reason: reason};
          }
        );
      };

      // TODO filter
      var allSettledFulfilled = function () {
        throw Error('not implemented yet');
      };

      // TODO filter
      var allSettledRejected = function () {
        throw Error('not implemented yet');
      };

      /**
       * @name $q#allSettled
       * @kind function
       *
       * @description
       * Waits for all of the promises to either be fulfilled or rejected.
       *
       * @param {Array.<Promise>|Object.<Promise>} promises An array or hash of promises.
       * @returns {Array.<Promise>|Object.<Promise>}
       *
       * <pre>
       *     {state: 'fulfilled', value: value}
       *     or
       *     {state: 'rejected', reason: reason}
       * </pre>
       */
      var allSettledDecorator = function (promises) {
        if (!angular.isArray(promises)) {
          return settle(promises);
        }

        var results = [];
        angular.forEach(promises, function (promise, key) {
          results[key] = settle(promise);
        });

        return $q.all(results);
      };

      // don't override if is already defined
      $q.isFulfilledState = $q.isFulfilledState || isFulfilledState;
      $q.isRejectedState = $q.isRejectedState || isRejectedState;
      $q.allSettled = $q.allSettled || allSettledDecorator;
      $q.allSettledFulfilled = $q.allSettledFulfilled || allSettledFulfilled;
      $q.allSettledRejected = $q.allSettledRejected || allSettledRejected;

      return $q;
    }]);

  }

})();
