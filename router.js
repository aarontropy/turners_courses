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
        template: 'courseEdit',
        waitOn: function() {
            return Meteor.subscribe('session', this.params.session_id);
        },
        data: function() {
            dataObj = {};
            if (this.params.session_id) {
                dataObj.session = Sessions.findOne({_id: this.params.session_id});
            }
            return dataObj;
        }
    });

    this.route('courseDetail', {
        path: '/course/:_id',
        template: 'courseDetail',
        before: [
            function() {
                this.subscribe('course', this.params._id).wait();
            }
        ]
    });

    // this.route('courseEdit', {
    //     path: '/course/edit/:_id',
    //     template: 'courseEdit',
    // });

});