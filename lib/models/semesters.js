Semesters = new Meteor.Collection("semesters");
Semesters.allow({
    update: function() {
        return true;
    }
})
Semesters.toggleLock = function(s_id) {
    var semester = Semesters.findOne(s_id);
    if (semester) {
        Semesters.update(s_id, {$set: {locked: !semester.locked}});
    }
}
Semesters.toggleVisible = function(s_id) {
var semester = Semesters.findOne(s_id);
    if (semester) {
        Semesters.update(s_id, {$set: {visible: !semester.visible}});
    }
}

Semesters.activateSemester = function(s_id) {
    Meteor.call('activateSemester', s_id);
}

Semesters.slugify = function(title) {
    var slug,
        n = 1;

    title = title.trim().replace(/\s+/g, "_").slice(0,24);
    slug = title;
    while (Semesters.find({slug:slug}).count()) {
        console.log("updating slug");
        slug = title + "_" + n++;
    }
    return slug;
}

Semesters.insertSemester = function(semester) {
    if (!semester.title) return;

    defaults = {
        slug: Semesters.slugify(semester.title),
        created: new Date(),
        visible: false,
        active: false,
    }
    semester = _.extend(defaults, semester)
    Semesters.insert(semester);
}

