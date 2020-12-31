parasails.registerPage('accounts', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    users: [],
    currentSortField: '',
    currentSortOrder: 'asc',
    fullNameClass: 'fa fa-sort',
    aliasClass: 'fa fa-sort',
    emailAddressClass: 'fa fa-sort',
    emailStatusClass: 'fa fa-sort',
    isSuperAdminClass: 'fa fa-sort'
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    _.extend(this, SAILS_LOCALS);
    this.users = this._marshalEntries(this.users);
  },

  mounted: async function() {
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

    resetTableHeader() {
      this.fullNameClass = 'fa fa-sort';
      this.aliasClass = 'fa fa-sort';
      this.emailAddressClass = 'fa fa-sort';
      this.emailStatusClass = 'fa fa-sort';
      this.isSuperAdminClass = 'fa fa-sort';
    },

    sortBy(field, order) {
      this.resetTableHeader();
      if (field != this.currentSortField) {
        this.currentSortOrder = 'asc'; // reset to ascending
      } else {
        this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
      }
      this[field+'Class'] = 'fa fa-sort-' + this.currentSortOrder;
      this.currentSortField = field;
      this.users.sort((a,b) => {
        let modifier = 1;
        if (this.currentSortOrder === 'desc') modifier = -1;
        if (a[this.currentSortField] < b[this.currentSortField]) return -1 * modifier;
        return 1 * modifier;
      });
    }

  }
});
