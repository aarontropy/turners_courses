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
        before: [
            function() {
                this.subscribe('sessions').wait();
            }
        ]
    });


    this.route('sessionDetail', {
        path: '/session/:_id',
        template: 'sessionDetail',
        before: [
            function() { 
                this.subscribe('session', this.params._id).wait(); 
                this.subscribe('sessionCourses', this.params._id);
            },
        ]
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
            return {
                session: Sessions.findOne({_id: this.params.session_id}),
            }
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