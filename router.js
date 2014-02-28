Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', {
        path: '/',
        template: 'home',
    });

    this.route('sessionList', {
        path: '/sessions',
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
        path: '/session/:_id',
        template: 'sessionDetail',
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
        }
    });


    /*  ------------------------------------------------------------------------
        Courses
        -----------------------------------------------------------------------*/
    this.route('courseAdd', {
        path: '/course/add',
        template: 'courseAdd',
        waitOn: function() {
            return Meteor.subscribe('session', this.params.session_id);
        },
        data: function() {
            dataObj = {
                course: {},
            };

            if (this.params.session_id) {
                dataObj.session = Sessions.findOne();
            }
            return dataObj;
        }
    });



    this.route('courseEdit', {
        path: '/course/edit/:_id',
        template: 'courseEdit',
        waitOn: function() {
            return this.subscribe('courseWithSession', this.params._id)
        },
        data: function() {
            return {
                course: Courses.findOne(),
                session: Sessions.findOne(),
            }
        }
    });

    this.route('courseDetail', {
        path: '/course/:_id',
        template: 'courseDetail',
        waitOn: function() {
            return this.subscribe('courseWithSession', this.params._id)
        },
        data: function() {

            course: Courses.findOne();
            session: Sessions.findOne();
        }
    });

    // this.route('courseEdit', {
    //     path: '/course/edit/:_id',
    //     template: 'courseEdit',
    // });

});