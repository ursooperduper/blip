/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var AppDispatcher = require('../AppDispatcher');
var AppConstants = require('../AppConstants');
var EventEmitter = require('events').EventEmitter;
var merge = require('react/lib/merge');

var CHANGE_EVENT = 'change';

var getInitialState = function() {
  return {
    error: null
  };
};

var RequestStore = merge(EventEmitter.prototype, {

  _state: getInitialState(),

  reset: function() {
    this._state = getInitialState();
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getError: function() {
    return this._state.error;
  }

});

RequestStore.dispatchToken = AppDispatcher.register(function(payload) {
  var self = RequestStore;
  switch(payload.type) {

    case AppConstants.request.DISMISSED_REQUEST_ERROR:
      self._state.error = null;
      self.emitChange();
      break;

    case AppConstants.api.FAILED_LOGIN:
      // Don't handle wrong credentials globally
      if (payload.error && payload.error.status !== 401) {
        self._state.error = {
          key: AppConstants.api.FAILED_LOGIN,
          message: 'Something went wrong while logging in',
          original: payload.error
        };
      }
      self.emitChange();
      break;

    case AppConstants.api.FAILED_SIGNUP:
      // Don't handle "username already taken" globally
      if (payload.error && payload.error.status !== 400) {
        self._state.error = {
          key: AppConstants.api.FAILED_SIGNUP,
          message: 'Something went wrong while signing up',
          original: payload.error
        };
      }
      self.emitChange();
      break;

    case AppConstants.api.FAILED_LOGOUT:
      self._state.error = {
        key: AppConstants.api.FAILED_LOGOUT,
        message: 'Something went wrong while logging out',
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_GROUPS:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_GROUPS,
        message: 'Something went wrong while trying to fetch groups user has access to',
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_GROUP:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_GROUP,
        groupId: payload.groupId,
        message: 'Something went wrong while trying to fetch group ' + payload.groupId,
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_CREATE_GROUP:
      self._state.error = {
        key: AppConstants.api.FAILED_CREATE_GROUP,
        message: 'Something went wrong while trying to create group',
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_UPDATE_GROUP:
      self._state.error = {
        key: AppConstants.api.FAILED_UPDATE_GROUP,
        groupId: payload.group.userid,
        message: 'Something went wrong while trying to update group ' + payload.groupId,
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_INVITATIONS_RECEIVED:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_INVITATIONS_RECEIVED,
        message: 'Something went wrong while trying to fetch received invitations',
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_INVITATIONS_SENT:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_INVITATIONS_SENT,
        groupId: payload.groupId,
        message: 'Something went wrong while trying to fetch sent invitations for group ' + payload.groupId,
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_HEALTH_DATA:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_HEALTH_DATA,
        groupId: payload.groupId,
        message: 'Something went wrong while trying to fetch health data for group ' + payload.groupId,
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.FAILED_GET_MESSAGE_THREAD:
      self._state.error = {
        key: AppConstants.api.FAILED_GET_MESSAGE_THREAD,
        threadId: payload.threadId,
        message: 'Something went wrong while trying to fetch message thread ' + payload.threadId,
        original: payload.error
      };
      self.emitChange();
      break;

    case AppConstants.api.COMPLETED_LOGOUT:
      self.reset();
      self.emitChange();
      break;

    default:
      // Do nothing
  }

});

module.exports = RequestStore;
