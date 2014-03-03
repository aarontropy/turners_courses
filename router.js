Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'home',
    });

    this.route('sessionList', {
        path: '/admin/sessions',
        template: 'sessionList',
        waitOn: function() {
            return this.subscribe('sessions');
        },
        data: function() {
            return {
                sessions: Sessions.find(),
            }
        }
    });


    this.route('sessionDetail', {
        path: '/admin/session/:_id',
        template: 'adminSessionEdit',
        waitOn: function() {
            return [
                this.subscribe('session', this.params._id),
                this.subscribe('sessionCourses', this.params._id)
            ];
        },
        data: function() {
            return {
                session: Sessions.findOne(), 
                courses: Courses.find(),
            }
        },
        before: [
            function() {
                Session.set('showAddCourse', false);
            }
        ]
    });


    /*  ------------------------------------------------------------------------
        Courses
        -----------------------------------------------------------------------*/
    this.route('adminCourseEdit', {
        path: '/admin/course/edit/:_id',
        template: 'adminCourseEdit',
        waitOn: function() {
            return this.subscribe('courseWithSession', this.params._id)
        },
        data: function() {
            return {
                course: Courses.findOne(),
                session: Sessions.findOne(),
            }
        }
    })


});