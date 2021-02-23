parasails.registerPage('notices', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    notices: [],
    cloudError: '',
    createOrUpdateNoticeFormSuccess: false,
    createOrUpdateNoticeFormTitle: '',
    creatingOrUpdatingNotice: false,
    formErrors: {},
    levels: ['everyone'],
    noticeDef: {
      id: undefined,
      title: '',
      message: '',
      level: 'everyone',
      active: false
    },
    moveHoursWaiting: 24,
    syncing: false,
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
    this.notices = this._marshalEntries(this.notices);
  },

  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {

    _marshalEntries: function(entries) {
      // Marshal provided array of data and return the modified version.
      return _.map(entries, (entry) => {

        return entry;
      });
    },

    closeCreateOrUpdateNoticeForm: function() {
      this.creatingOrUpdatingNotice = false;
    },

    openCreateOrUpdateNoticeForm: function() {
      this.creatingOrUpdatingNotice = true;
      return;
    },

    showCreateNoticeForm() {
      this.creatingOrUpdatingNotice = true;
      this.noticeDef = {
        active: false,
        id: undefined,
        title: '',
        level: 'everyone',
        message: ''
      };
      this.createOrUpdateNoticeFormTitle = 'Create Notice';
      return;
    },

    showLocalTime(createdAt) {
      return((new Date(createdAt).toLocaleDateString()) + ' ' + (new Date(createdAt).toLocaleTimeString()));
    },

    showUpdateNoticeForm(id) {
      this.creatingOrUpdatingNotice = true;
      this.noticeDef = this.notices.filter(notice => {
        return notice.id === id;
      })[0];
      this.createOrUpdateNoticeFormTitle = 'Update Notice';
      return;
    },

    submittedCreateOrUpdateNoticeForm() {
      this.creatingOrUpdatingNotice = false;
      this.createOrUpdateNoticeFormSuccess = true;
      this.goto('notices');
      return;
    },

  }

});
