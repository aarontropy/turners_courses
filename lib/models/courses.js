Courses = new Meteor.Collection("courses");
Courses.allow({
    insert: function(userId, doc) {
        // Require that the course has an index and a semester_id
        return doc.index !== undefined && doc.semester_id
    },
    update: function(userId, doc) {
        return true;
    },
    remove: function(userId, doc) {
        return Roles.userIsInRole(userId, ['administrator']);
    }
});

Courses.slugify = function(title, s_id) {
    var slug,
        n = 1;

    title = title.trim().replace(/\s+/g, "_").slice(0,24);
    slug = title;
    while (Courses.find({semester_id: s_id, slug:slug}).count()) {
        slug = title + "_" + n++;
    }
    return slug;
}


Courses.courseMeetings = function(course) {
    var meetings = [];
    var startDate = course.startDate || Semesters.findOne({_id: course.semester_id}).startDate || undefined;
    console.log(startDate)
    return;

    if (course.rule && course.rule.count) {
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

Courses.insertCourse = function(course) {
    if (!course.title || !course.semester_id) return;

    var lastCourse = Courses.findOne({semester_id: course.semester_id}, {sort: {index: -1}});
    var index = (lastCourse) ? lastCourse.index + 1 : 0;
    var defaults = {
        slug: Courses.slugify(course.title, course.semester_id),
        index: index,
    }
    course = _.extend(defaults, course);
    Courses.insert(course);
}

Courses.updateCourse = function(_id, course) {
    if (course.title) {
        // if the title is changed, change the slug as well
        semester_id = Courses.findOne(_id).semester_id;
        course.slug = Courses.slugify(course.title, semester_id);
    }
    if (course.semester_id) {
        // disallow changes to the semester_id
        delete course.semester_id;
    }
    Courses.update(_id, {$set: course});
}
