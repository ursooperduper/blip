var rCB = function(){};
var deviceDataGlobalCallback = function(data) {
  console.info('Got Data from DeviceDataGlobalCallback',data);
  rCB(null, data);
};

$(function() {

// saves user to global data variable - all api calls are authenticated with accessToken anyways
model.user = function(callback) {
  $.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/user?accessToken=' + accessToken + '&callback=?', function(user) {
    data.user = user;
    callback(null, user);
  }).error(function(error) {
  	data.user = null;
    callback(error);
  });
};

model.uploadAnimas = function(groupId, callback) {
  var userId = data.user ? data.user.id : '';

  $.ajax({
    url: 'http://'+ window.location.host +'/v1/' + groupId + '/device/animas/upload?userId=' + userId,
    type: 'POST',
    xhr: function() {
      var myXhr = $.ajaxSettings.xhr();
      return myXhr;
    },
    beforeSend: function(){},
    success: function(data) {
      console.info('Upload data succeded', data);
      callback(null, data);
    },
    error: callback,
    data: new FormData($('#join_upload_animas_form')[0]),
    cache: false,
    contentType: false,
    processData: false
  });
};

model.upload = function(groupId, callback) {
  var userId = data.user ? data.user.id : '';

  $.ajax({
    url: 'http://'+ window.location.host +'/v1/' + groupId + '/device/upload?userId=' + userId,
    type: 'POST',
    xhr: function() {
      var myXhr = $.ajaxSettings.xhr();
      return myXhr;
    },
    beforeSend: function(){},
    success: function(data) {
      console.info('Upload data succeded', data);
      callback(null, data);
    },
    error: callback,
    data: new FormData($('#join_upload_form')[0]),
    cache: false,
    contentType: false,
    processData: false
  });
};

model.lastUpload = function(groupId, callback) {
  $.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/' + groupId + '/lastUpload?callback=?', function(group) {    
    callback(null, group);
  }).error(callback);
}

model.deviceData = function(groupId, callback) {
  console.info('Fetching Device Data');
  rCB = callback;

  model.lastUpload(groupId, function(error, group) {
    if(error) {
      alert('Error fetchin last upload id');
      console.error('error',error);
      return;
    }

    $.ajax({
      url: 'http://'+$('#api_endpoint').attr('content')+'/v1/' + groupId +'/'+ group.uploadId + '/data?limit=1000000&callback=?',
      dataType: 'jsonp',
      jsonpCallback: 'deviceDataGlobalCallback',
      cache: true,
      success: function(data) {},
      error: callback
    });
  });
};

model.groups = {
  get: function(id, callback) {
    $.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/groups/'+ id + '?accessToken=' + accessToken + '&callback=?', function(group) {
      callback(null, group);
    }).error(callback);    
  },
  select: function(id, callback) {
    $.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/groups/'+ id + '/select?accessToken=' + accessToken + '&callback=?', function() {
      model.user(function(error, user) {
        callback(error, id);
      });
    }).error(callback);
  },
	selectedNotAdmin: function(callback) {
		$.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/groups?selected=true&administrator=false&accessToken=' + accessToken + '&callback=?', function(groups) {
      callback(null, groups);
    }).error(callback);
	},
  administrator: function(callback) {
    $.getJSON('http://'+$('#api_endpoint').attr('content')+'/v1/groups?administrator=true&accessToken=' + accessToken + '&callback=?', function(groups) {
      callback(null, groups);
    }).error(callback);
  }
};

model.post = {
	user: function(callback) {
		$.ajax({
      url: 'http://'+ window.location.host +'/v1/user/join?accessToken=' + accessToken ,
      type: 'POST',
      xhr: function() {
        var myXhr = $.ajaxSettings.xhr();
        return myXhr;
      },
      beforeSend: function(){},
      success: function(data) {
      	var cb = callback;
        model.user(function() {
        	cb(null, data);
        });
      },
      error: callback,
      data: new FormData($('form')[0]),
      cache: false,
      contentType: false,
      processData: false
    });
	}
}

});