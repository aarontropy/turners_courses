Sessions = new Meteor.Collection("sessions");



Courses = new Meteor.Collection("courses");
Courses.allow({
	insert: function(userId, doc) {
		// Require that the course has an index and a session_id
		return doc.index !== undefined && doc.session_id
	},
	update: function(userId, doc) {
		return true;
	},
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['administrator']);
    }
});


courseMeetings = function(course) {
    var meetings = [];
    var startDate = course.startDate || Sessions.findOne({_id: course.session_id}).startDate || undefined;

    if (course.rule) {
        var dtstart = moment(startDate);
        var time = (course.rule.startTime) ? course.rule.startTime.split(":") : ['17','0'];
        dtstart.set('hour', time[0]).set('minute',time[1]).set('second', 0);
        
        var wds = [RRule.SU, RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR, RRule.SA];
        var byweekday = _.filter(wds, function(wd, idx) { return course.rule.days[idx]; });
        
        var rule =  new RRule({
            dtstart: dtstart.toDate(),
            freq: RRule.WEEKLY,
            byweekday: byweekday,
            count: course.rule.count,
        });

        _.each(rule.all(), function(date, idx) {
            meetings.push({
                id: course._id + "_" + idx,
                title: course.title,
                start: date,
                end: moment(date).add('hours', course.duration || 1).toDate(),
                color: colorList[course.index % colorList.length]
            });
        });
    }
    return meetings;

}

insertCourse = function(course) {
    console.log(course)
    var lastCourse = Courses.findOne({session_id: course.session_id}, {sort: {index: -1}});
    if (lastCourse) {
        course.index = lastCourse.index + 1;
    } else {
        course.index = 0;
    }
    Courses.insert(course);
}




Meetings = new Meteor.Collection("meetings");



Meteor.users.allow({
    update: function(userId, docs, fields, modifier) {
        return true;
    },
})