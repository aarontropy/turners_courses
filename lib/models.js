Sessions = new Meteor.Collection("sessions");



Courses = new Meteor.Collection("courses");
Courses.allow({
	insert: function(userId, doc) {
		// Require that the course has an index and a session_id
		return doc.index && doc.session_id
	},
});


Meetings = new Meteor.Collection("meetings");
