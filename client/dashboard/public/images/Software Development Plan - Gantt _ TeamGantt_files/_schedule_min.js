function TGEvents() {  this.GANTT_LOADED='gantt_loaded';
  this.CURRENT_USER_LOADED='current_user_loaded';
  this.TASK_RENAMED='task_renamed';
  this.TASK_ADDED='task_added';
  this.GROUP_RENAMED='group_renamed';
  this.HASH_CHANGED='hash_changed';
  this._init();
}
TGEvents.prototype._init=function () {  this._eventBus=document.createComment('tg_event_bus');
  document.appendChild(this._eventBus);
};
/**
 * Publish an event
 * @param {string} eventName
 * @param {object} detail
 */
TGEvents.prototype.publish=function (eventName, detail) {  this._eventBus.dispatchEvent(new CustomEvent(eventName, {detail: detail}));
};
/**
 * Subscribe a listener to an event
 * @param {string} eventName
 * @param {Function} callback
 * @returns {Function} unsubscribe function
 */
TGEvents.prototype.subscribe=function (eventName, callback) {  function detailOnlyCb(event) {    callback(event.detail);
  }
  this._eventBus.addEventListener(eventName, detailOnlyCb);
  return this.unsubscribe.bind(this, eventName, detailOnlyCb);
};
/**
 * Unsubscribe the listener from an event
 * @param {string} eventName
 * @param {Function} callback
 */
TGEvents.prototype.unsubscribe=function (eventName, callback) {  this._eventBus.removeEventListener(eventName, callback);
};
/**
 * Subscribe to listener only once
 * @param {string} eventName
 * @param {Function} callback
 */
TGEvents.prototype.subscribeOnce=function (eventName, callback) {  var unsubscribe=this.subscribe(eventName, function (details) {    callback(details);
    unsubscribe();
  });
};
/**
 * Subscribe to multiple events. Callback called once when all have fired.
 * @param {string[]} eventNames
 * @param {Function} callback
 */
TGEvents.prototype.subscribeAll=function (eventNames, callback) {  var details=[];
  var count=0;
  function waiter(eventName, detail) {    details[eventNames.indexOf(eventName)]=detail;
    count++;
    if (count === eventNames.length) {      callback(details);
      removeAll();
    }
  }
  function addListener(eventName) {    return this.subscribe(eventName, waiter.bind(this, eventName));
  }
  var removeListeners=eventNames.map(addListener.bind(this));
  function removeAll() {    removeListeners.forEach(function (remove) {      remove();
    });
  }};
/**
 * Kill all events and reset the bus.
 */
TGEvents.prototype.kill=function () {  this._eventBus.remove();
  this._init();
};
window.tgEvents=new TGEvents();
(function () {  if (typeof window.CustomEvent === 'function') return false;
  // IE CustomEvent Polyfill
  function CustomEvent(event, params) {    params=params || {bubbles: false, cancelable: false, detail: null};
    var evt=document.createEvent('CustomEvent');
    evt.initCustomEvent(
      event,
      params.bubbles,
      params.cancelable,
      params.detail
    );
    return evt;
  }
  window.CustomEvent=CustomEvent;
})();
/**
 * Track an event to Segment
 * @param {{string}} event
 * @param {{Object}} [properties]
 * @returns
 */
function track_segment_event(event, properties) {  var is_debugging=window.location.href.indexOf('prod.teamgantt.com') === -1;
  if (is_debugging) {    window.console.log('track_segment_event', event, properties);
    return;
  }
  if (!window.analytics) {    return;
  }
  window.analytics.track(event, properties);
}
(function () {  // fail silently on pages that do not support tgEvents but need segment
  if (typeof tgEvents === 'undefined') {    return;
  }
  tgEvents.subscribe(tgEvents.TASK_ADDED, function () {    track_segment_event('task added', {location: 'gantt'});
  });
  tgEvents.subscribe(tgEvents.TASK_RENAMED, function () {    track_segment_event('task-renamed');
  });
  tgEvents.subscribe(tgEvents.GROUP_RENAMED, function () {    track_segment_event('group-renamed');
  });
})();
// JavaScript Document
var _xml=null;
var _projects=null;
var _groups=null;
var _tasks=null;
var _critical_paths=null;
var _need_refresh=null;
var _total_tasks=0;
var _force_cal_start=false;
var _projects_key=null;
var _groups_key=null;
var _tasks_key=null;
//TITLE MESSAGES
var _titles=[];
//META PANEL
_titles['meta_document']='Upload document';
_titles['meta_comment']='Comments';
//CATEGORY TASK LIST
//PROJECT
_titles['list_project_edit']='Open project details';
//GROUP
_titles['list_group_dnd']='Reorder groups';
_titles['list_group_collapse1']='Collapse group';
_titles['list_group_collapse2']='Open group';
_titles['list_group_name']='Click to edit group name';
_titles['list_group_edit']='Open group details';
_titles['list_group_delete']='Delete group';
_titles['gantt_group_edit']='Open group details';
_titles['gantt_group_color']='Adjust color of all tasks in group';
//TASK
_titles['list_task_dnd']='Reorder tasks';
_titles['list_task_name']='Click to edit task name';
_titles['list_task_edit']='Open task details';
_titles['list_task_delete']='Delete task';
_titles['list_resize']='Click and drag to resize';
//CENTER PANEL
_titles['task_percent_complete']='Edit percent complete';
//GANTT
//TASK
_titles['gantt_task_vdnd']='Click and drag to reorder';
_titles['gantt_task_cp'] =
  'Click and drag to another task to create a dependency';
_titles['gantt_task_extend_front']='Click and drag to change start date';
_titles['gantt_task_extend_back']='Click and drag to change end date';
_titles['gantt_task_edit']=_titles['list_task_edit'];
_titles['gantt_task_delete']=_titles['list_task_delete'];
_titles['gantt_task_resources']='Assign task';
_titles['gantt_task_color']='Change task bar color';
//POPUPS
//EDIT WINDOW
_titles['remove_cp']='Delete dependency';
var _min_date=null;
var _max_date=null;
var _all_resources=null;
var _full_width=null;
var _chart_days=[0, 1, 2, 3, 4, 5, 6];
var _holidays=[];
var _highlight_days=[];
window.onresize=function () {  set_scroll_bar();
  check_scroll();
  set_resource_view_scroll();
  adjust_left_panel_width(_left_width);
};
function comment_document_icon(object) {  var icon='discussion';
  var count=object['document_count'] * 1 + object['comment_count'] * 1;
  var has_documents=object['document_count'] > 0;
  var has_unread =
    object['document_edit_date'] > object['user_document_edit_date'] ||
    object['comment_edit_date'] > object['user_comment_edit_date'];
  if (has_documents) {    icon='discussion-attachment';
  }
  if (icon != null && has_unread) {    icon += ' unread';
  }
  return {    icon: icon,
    count: count,
  };
}
//FOR KEEPING THE CHART IN PLACE ON REFRESH
var _scroll_month_id=null;
var _scroll_month_extra=0;
_xml=null;
var _middle_date=null;
function ensure_groups() {  if (any_filters_with_color()) {    return;
  }
  var empty_projects=_projects.filter(function (project) {    var can_create_groups=/admin|edit/.test(project.project_permission);
    if (!can_create_groups) {      return false;
    }
    var project_groups=_groups.filter(function (group) {      return group.project_id === project.project_id;
    });
    return project_groups.length === 0;
  });
  if (empty_projects.length > 0) {    var projects_processed=0;
    empty_projects.forEach(function (project) {      new $ajax({        parent: this,
        type: 'POST',
        url: API_URL + 'v1/groups',
        data: {          project_id: project.project_id,
          name: 'First group (click to rename)',
        },
        response: function (data) {          projects_processed++;
          if (projects_processed === empty_projects.length) {            load_gantt();
          }
        },
      });
    });
  }}
var reloads=0;
function load_gantt(return_functions) {  return_functions=return_functions || [-1];
  $id('tg_body').style.overflowY='auto';
  if (_version == 'gantt_chart') {    select_header_tab($id('header_schedule_tab'));
  } else if (_version == 'list_view') {    select_header_tab($id('header_list_tab'));
  }
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  //ajaxRequest.timeout=300000;
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState == 4) {      //TO SEE IF THE PAGE WAS OPENED FROM THE EMAIL -- IF SO, OPEN THE COMMENT WINDOW, IF NOT, DON'T THE PAGE WILL FREAK OUT
      var allow_open=HashSearch.keyExists('ids') == false ? true : false;
      //SET THE SCROLL AND URL VARIABLES
      window.scroll(0, scroll_top);
      var xml=ajaxRequest.responseXML;
      if (
        ajaxRequest.responseText.toLowerCase() == 'error' ||
        xml == null ||
        xml.getElementsByTagName('PROJECT').length == 0
      ) {        var val=get_public_keys();
        if (val == '') {          navigate_window(NEW_APP_URL + 'my-projects');
        } else if (val != '') {          if (val.indexOf('LOGIN') > -1) {            navigate_window(NEW_APP_URL + 'my-projects');
          } else {            window.location='../public/error.php';
          }
        } else {          window.location='../schedule/blank.html';
        }
      } else {        _xml=xml;
        _need_refresh=null;
        _total_tasks=0;
        parse_xml(xml);
        notify_projects_loaded();
        url_vars('set');
        // If user loaded list view, and they have the setting to use the new list view
        // // we want to push them to the new one instead
        if (window.listViewRedirect && window.listViewRedirect === true) {          open_new_list_view();
          return;
        }
        ensure_groups();
        window.scroll(0, scroll_top);
        clear_text();
        finish_load();
        if (typeof display_actual_hours_bar == 'function') {          display_actual_hours_bar();
        }
        setTimeout(finish_load, 2000);
        //FUNCTIONS TO RUN AFTER LOAD
        var temp_resource_view=_resource_view;
        _resource_view='closed';
        _multi_select.run_reset();
        _resource_view=temp_resource_view;
        setTimeout(load_critical_paths, 100);
        if ($id('selected_baselines').value != '') {          display_selected_baselines();
        }
        if (_version == 'gantt_chart') {          set_gantt_height();
        }
        if (_reopen_badge != null) {          if (_reopen_badge == 'resources') {            var parent_ele =
              _reopen_badge_details[0] +
              '_resources_' +
              _reopen_badge_details[1];
            var parent_element=$id(parent_ele);
            highlight_row(
              _reopen_badge_details[0],
              _reopen_badge_details[1],
              'hover_on'
            );
            display_badge_dd(
              'resources',
              _reopen_badge_details[0],
              _reopen_badge_details[1],
              parent_element,
              false
            );
          } else if (_reopen_badge == 'resources-column') {            $id('task_assigned_resources_' + _reopen_badge_details[1]).click();
          } else if (false && _reopen_badge == 'comments') {            open_meta_popup(
              _reopen_badge_details[0],
              _reopen_badge_details[1],
              $id(
                _reopen_badge_details[0] +
                  '_meta_comment_' +
                  _reopen_badge_details[1]
              )
            );
            load_note(
              _reopen_badge_details[0],
              _reopen_badge_details[1],
              _reopen_badge_details[2],
              _reopen_badge_details[3],
              _reopen_badge_details[4]
            );
          }
          _reopen_badge=null;
          _reopen_badge_details=null;
        } else if (_show_tooltips < 2) {          var tip_num=_tooltip_tip_num == null ? 0 : _tooltip_tip_num;
          show_tooltip(tip_num);
        } else if (return_functions[1]) {          var rf=return_functions;
          if (rf[0] == 'load_edit') {            //OPEN RESOURCES IF NECESSARY
            if (rf[1] == 'task' && rf[4] && rf[4] == 'open_resources') {              rf[3]=rf[4];
            }
            if (rf[1] == 'project') {              edit_project_info(rf[2], rf[3]);
            } else if (rf[1] == 'group') {              edit_group_info(rf[2], rf[3]);
            } else if (rf[1] == 'task') {              edit_task_info(rf[2], rf[3]);
            }
          } else if (rf[0] == 'update_percent') {            make_task_visible(rf[0]);
            $id('task_percent_input_' + rf[1]).onclick();
            setTimeout(function () {              highlight_row('task', rf[1], 'hover_on_force');
              var s_top =
                $id('task_percent_input_' + rf[1]).parentNode.parentNode
                  .offsetTop -
                page_sizes()[1] / 2;
              document.body.scrollTop=s_top;
              highlight_row('task', rf[1], 'hover_on_force');
            }, 500);
          } else if (rf[0] == 'load_invite') {            // open_iframe("../schedule/iframe/invite/?project_id="+rf[1]);
          } else if (rf[0] == 'focus_date') {            focus_today(rf[1], 'center', null);
          } else if (rf[0] == 'highlight-task' || rf[0] == 'highlight-group') {            setTimeout(function () {              var isGroup=rf[0] == 'highlight-group';
              var highlightTargetDate=isGroup
                ? _groups[_groups_key[rf[1]]]['min_date']
                : _tasks[_tasks_key[rf[1]]]['start_date'];
              focus_today(highlightTargetDate);
              resource_details_focus_target(isGroup ? 'group' : 'task', rf[1]);
            }, 350);
          }
        }
        open_overlay_from_hash();
        tgEvents.publish(tgEvents.GANTT_LOADED);
        reloads++;
        var filtered_tasks_count=$id('filtered_tasks_count');
        if (
          _total_tasks * 1 > _tasks.length * 1 ||
          $id('user_resources_selected').value != '' ||
          $id('custom_resources_selected').value != '' ||
          $id('company_resources_selected').value != '' ||
          $id('hide_completed').checked == true
        ) {          filtered_tasks_count.className='';
          remove_child_nodes(filtered_tasks_count);
          var difference=_total_tasks - _tasks.length;
          var tasks_length=_tasks.length;
          for (var t=0; t < tasks_length; t++) {            if (_tasks[t]['show_task'] == false) {              difference++;
            }
          }
          if (difference == 0) {            filtered_tasks_count.className='hidden';
          } else {            var diff_text =
              difference == 1
                ? difference + ' Task is hidden. '
                : difference + ' Tasks hidden. ';
            filtered_tasks_count.appendChild($text(diff_text));
            var clear_link=$create('SPAN');
            clear_link.style.marginLeft=0;
            clear_link.onclick=function () {              //CLEAR INPUTS
              $id('user_resources_selected').value='';
              $id('custom_resources_selected').value='';
              $id('company_resources_selected').value='';
              $id('date_filter').value='';
              $id('color_filter').value='';
              $id('hide_completed').checked=false;
              //CLEAR COLOR FILTERS
              var color_inputs=$id(
                'color_filters_dd_box'
              ).getElementsByTagName('INPUT');
              var cil=color_inputs.length;
              for (var c=0; c < cil; c++) {                color_inputs[c].checked=false;
              }
              select_color_filter(
                $id('color_filters_dd_box').getElementsByTagName('INPUT')[
                  c - 1
                ],
                'NO'
              );
              //CLEAR TIME FILTERS
              $id('filter_dates_other').getElementsByTagName(
                'DIV'
              )[0].firstChild.nodeValue='All dates';
              $id('filter_dates_other').className=trim(
                $id('filter_dates_other').className.replace(/selected_red/g, '')
              );
              //HIDE COMPLETED
              $id('hide_completed_check').className=trim(
                $id('hide_completed_check').className.replace(/checked/g, '')
              );
              //REFRESH GANTT
              load_gantt();
              track_segment_event('gantt-clicked-clear-filters');
            };
            clear_link.appendChild($text('(x) Clear'));
            filtered_tasks_count.appendChild(clear_link);
          }
        } else {          filtered_tasks_count.className='hidden';
        }
        _scroll_warning=true;
        //SINGLE FIRE TOOLTIPS
        if (_comment_tool_tip == 'show') {          comment_tooltip('show');
        }
        _xml=null;
        load_raci($id('project_ids').value.split(','));
      }
    }
  };
  start_load('chart');
  remove_background_cover(null);
  document.title='Loading...';
  //FOR KEEPING THE CHART IN PLACE ON REFRESH
  if ($id('tasks')) {    _middle_date=find_middle_date();
  }
  var editWindow=$id('edit_window');
  while (editWindow !== null) {    $id('edit_window').parentNode.removeChild($id('edit_window'));
    editWindow=$id('edit_window');
  }
  var editWindowBackground=$id('edit_window_background');
  while (editWindowBackground !== null) {    $id('edit_window_background').parentNode.removeChild(
      $id('edit_window_background')
    );
    editWindowBackground=$id('edit_window_background');
  }
  var scroll_top=get_scrolltop();
  _scroll_warning=false;
  _force_cal_start=false;
  var queryString='projects=' + $id('project_ids').value;
  queryString +=
    get_public_keys() != ''
      ? '&public_keys=' + encodeURIComponent(get_public_keys())
      : '';
  queryString +=
    get_share_key() != ''
      ? '&share=' + encodeURIComponent(get_share_key())
      : '';
  queryString += '&today_date=' + today_date();
  queryString += '&date_filter=' + $id('date_filter').value;
  queryString += '&color_filter=' + $id('color_filter').value;
  queryString += '&users=' + $id('user_resources_selected').value;
  queryString += '&company=' + $id('company_resources_selected').value;
  queryString += '&custom=' + $id('custom_resources_selected').value;
  queryString +=
    '&hide_completed=' + ($id('hide_completed').checked == true ? 1 : 0);
  queryString += '&original_ids=' + _original_ids;
  var dt=new Date();
  var dt_string =
    dt.getFullYear() +
    '' +
    dt.getMonth() +
    '' +
    dt.getDay() +
    '' +
    dt.getHours() +
    '' +
    dt.getMinutes() +
    '' +
    dt.getSeconds();
  queryString += '&x=' + dt_string;
  ajaxRequest.open('GET', '../schedule/xml.data.php?' + queryString, true);
  ajaxRequest.send(null);
  // header tabs
  var header_tabs=document.getElementById('header_tabs');
  if (window.location != window.parent.location) {    header_tabs.dataset.host=document.referrer;
  }}
function notify_projects_loaded() {  if (!_projects || _projects.length === 0) {    return;
  }
  // Send projects-loaded event to web-client
  parent_post_message('projects-loaded', {    projects: _projects.map((project) => {      const tasks=_tasks.filter((t) => t.project_id === project.project_id);
      return {        id: Number(project.project_id),
        companyId: Number(project.company_id),
        permission: project.project_permission,
        createdDate: project.time_stamp,
        taskCount: tasks.length,
      };
    }),
  });
}
function set_gantt_height() {  var window_height=window.screen.availHeight;
  var eles=['meta_data', 'category_task_list', 'task'];
  for (var e=0; e < eles.length; e++) {    if ($id(eles[e])) {      $id(eles[e]).style.minHeight=window_height + 'px';
    }
  }
  var divs1=$id('category_task_list').getElementsByTagName('DIV');
  var d1l=divs1.length;
  for (var d=0; d < d1l; d++) {    if (divs1[d].className.indexOf('task_wrapper') > -1) {      divs1[d].style.minHeight=window_height + 'px';
    }
  }
  var divs2=$id('tasks').getElementsByTagName('DIV');
  var d2l=divs2.length;
  for (var d=0; d < d2l; d++) {    if (divs2[d].className.indexOf('task_wrapper') > -1) {      divs2[d].style.minHeight=window_height + 'px';
    }
  }}
function parse_xml(xml) {  //SET PROJECT ARRAY
  _projects=new Array();
  _groups=new Array();
  _tasks=new Array();
  _projects_key=new Array();
  _groups_key=new Array();
  _tasks_key=new Array();
  var xml_permissions=[];
  var page_title='';
  _holidays=new Array();
  _highlight_days=new Array();
  //RESOURCES
  var all_resources=xml
    .getElementsByTagName('ALL_RESOURCES')[0]
    .getElementsByTagName('RESOURCE');
  _all_resources=all_resources;
  var target1=$id('people_resources');
  var target2=$id('other_resources');
  remove_child_nodes(target1);
  remove_child_nodes(target2);
  all_res_length=all_resources.length;
  for (var r=0; r < all_res_length; r++) {    var res=all_resources[r];
    var LINK_TYPE=getNodeValue(res, 'LINK_TYPE');
    var PROJECT_ID=getNodeValue(res, 'PROJECT_ID');
    var RESOURCE_ID=getNodeValue(res, 'RESOURCE_ID');
    var RESOURCE_NAME=getNodeValue(res, 'RESOURCE_NAME');
    var li=$create('DIV');
    li.className='option option2 option_small';
    var label=$create('LABEL');
    label.setAttribute('for', 'resource_' + LINK_TYPE + '_' + RESOURCE_ID);
    var input=$create('INPUT');
    input.type='checkbox';
    input.setAttribute('link_type', LINK_TYPE);
    input.value=RESOURCE_ID;
    input.id='resource_' + LINK_TYPE + '_' + RESOURCE_ID;
    input.setAttribute('link_type', LINK_TYPE);
    input.setAttribute('resource_id', RESOURCE_ID);
    if (
      js_in_array(
        RESOURCE_ID,
        $id(LINK_TYPE + '_resources_selected').value.split(',')
      ) > -1
    ) {      input.checked=true;
    }
    input.onclick=function () {      var ele=$id(this.getAttribute('link_type') + '_resources_selected');
      if (this.checked == false) {        //remove
        var st=ele.value.split(',');
        var string='';
        for (var s=0; s < st.length; s++) {          if (st[s] != this.getAttribute('resource_id')) {            string += string == '' ? '' : ',';
            string += st[s];
          }
        }
        ele.value=string;
      } else {        //add
        ele.value += ele.value == '' ? '' : ',';
        ele.value += this.getAttribute('resource_id');
        track_segment_event('filter_applied');
        track_segment_event('gantt-applied-everyone-filter');
      }
      //parse_xml(xml);
      check_scroll();
      url_vars('set');
      load_gantt();
    };
    label.appendChild(input);
    label.appendChild($text(RESOURCE_NAME));
    li.appendChild(label);
    var available=$create('DIV');
    available.className='view_availability';
    available.setAttribute(
      'href',
      'index.php?ids=MY-ACTIVE&public_keys=LOGIN#&' +
        LINK_TYPE +
        '=' +
        RESOURCE_ID +
        '&hide_completed=true'
    );
    available.onclick=function () {      open_inner_popup(this);
      return false;
    };
    available.title =
      "Click to view this resource's remaining tasks across all projects.";
    //available.appendChild($text( "(view)" ));
    li.appendChild(available);
    if (LINK_TYPE == 'user') {      target1.appendChild(li);
    } else if (LINK_TYPE == 'company') {      target2.appendChild(li);
    } else {      target2.appendChild(li);
    }
  }
  var other_title=$id('other_resources_title');
  if (target2.childNodes.length == 0) {    other_title.style.display='none';
    target2.style.display='none';
    var li=$create('DIV');
    li.className='option2 option_small';
    li.appendChild($text('No company resources for this project.'));
    li.style.color='#777';
    target2.appendChild(li);
  } else {    other_title.style.display='';
    target2.style.display='';
  }
  //GLOBALS
  var globals=xml.getElementsByTagName('GLOBALS')[0];
  _min_date=globals.getElementsByTagName('MIN_DATE')[0].textContent;
  _max_date=globals.getElementsByTagName('MAX_DATE')[0].textContent;
  var integrate_projects=[];
  //LOOP THROUGH PROJECTS
  var projects=xml.documentElement.getElementsByTagName('PROJECT');
  var projects_length=projects.length;
  var project_ids=[];
  for (var p=0; p < projects_length; p++) {    var project=projects[p];
    var project_id=getNodeValue(project, 'PROJECT_ID');
    var plen=_projects.length;
    project_ids.push(project_id);
    //SET PROJECT VARIABLE DATA
    _projects[plen]=[];
    _projects[plen]['project_id']=project_id;
    _projects[plen]['project_name']=getNodeValue(project, 'PROJECT_NAME');
    _projects[plen]['project_status']=getNodeValue(project, 'PROJECT_STATUS');
    _projects[plen]['project_template']=getNodeValue(
      project,
      'PROJECT_TEMPLATE'
    );
    _projects[plen]['project_enable_hours']=getNodeValue(
      project,
      'PROJECT_ENABLE_HOURS'
    );
    _projects[plen]['project_in_resource_management']=getNodeValue(
      project,
      'PROJECT_IN_RESOURCE_MANAGEMENT'
    );
    _projects[plen]['project_include_holidays']=getNodeValue(
      project,
      'PROJECT_INCLUDE_HOLIDAYS'
    );
    _projects[plen]['project_permission']=getNodeValue(
      project,
      'PROJECT_PERMISSION'
    );
    _projects[plen]['time_stamp']=getNodeValue(project, 'TIME_STAMP');
    _projects[plen]['company_id']=getNodeValue(project, 'COMPANY_ID');
    _projects[plen]['company_plan']=getNodeValue(project, 'COMPANY_PLAN');
    _projects[plen]['company_plan_code']=getNodeValue(
      project,
      'COMPANY_PLAN_CODE'
    );
    _projects[plen]['company_permission']=getNodeValue(
      project,
      'COMPANY_PERMISSION'
    );
    _projects[plen]['chart_days']=getNodeValue(project, 'CHART_DAYS');
    _projects[plen]['cal_start_date']=getNodeValue(project, 'CAL_START_DATE');
    _projects[plen]['public_key']=getNodeValue(project, 'PUBLIC_KEY');
    _projects[plen]['user_public_key']=getNodeValue(
      project,
      'USER_PUBLIC_KEY'
    );
    _projects[plen]['project_zoom']=getNodeValue(project, 'PROJECT_ZOOM');
    _projects[plen]['time_tracking']=getNodeValue(project, 'TIME_TRACKING');
    _projects[plen]['disabled']=getNodeValue(project, 'DISABLED');
    _projects[plen]['integration_app']=getNodeValue(project, 'INTEGRATION');
    _projects[plen]['total_tasks']=getNodeValue(project, 'TOTAL_TASKS');
    _total_tasks += _projects[plen]['total_tasks'] * 1;
    if (
      _projects[plen]['cal_start_date'] != '' &&
      _projects[plen]['cal_start_date'] != '0000-00-00' &&
      _projects[plen]['cal_start_date'] < _min_date
    ) {      _min_date=_projects[plen]['cal_start_date'];
      _force_cal_start=true;
    }
    if (_projects[plen]['integration_app'] == 'Basecamp') {      integrate_projects.push(_projects[plen]['project_id']);
    }
    if (
      p == 0 &&
      _projects[plen]['project_zoom'] != '' &&
      _version == 'gantt_chart' &&
      !_is_iframe_view
    ) {      select_zoom(_projects[plen]['project_zoom']);
    }
    //DOCUMENTS * COMMENTS
    var temp_comment=project.getElementsByTagName('COMMENT')[0];
    _projects[plen]['comment_count']=temp_comment.getAttribute('count');
    _projects[plen]['comment_edit_date']=temp_comment.getAttribute('date');
    _projects[plen]['user_comment_edit_date'] =
      temp_comment.getAttribute('user');
    var temp_document=project.getElementsByTagName('DOCUMENT')[0];
    _projects[plen]['document_count']=temp_document.getAttribute('count');
    _projects[plen]['document_edit_date']=temp_document.getAttribute('date');
    _projects[plen]['user_document_edit_date'] =
      temp_document.getAttribute('user');
    //IF BEING ACCESSED BY A PUBLIC KEY -- SET THE COUNTS TO THE SAME SO THEY DON'T SHOW THE NEW ICON
    if (_projects[plen]['public_key'] == _projects[plen]['user_public_key']) {      _projects[plen]['user_comment_edit_date'] =
        _projects[plen]['comment_edit_date'];
      _projects[plen]['user_document_edit_date'] =
        _projects[plen]['document_edit_date'];
    }
    _projects_key[project_id]=plen;
    //UPDATE PAGE TITLE
    page_title += page_title == '' ? '' : ', ';
    page_title += _projects[plen]['project_name'];
    //IF FIRST PROJECT - BUILD THE PAGE (now that we have the chart_days value)
    if (p == 0) {      _chart_days=_projects[0]['chart_days'];
      var holidays=project
        .getElementsByTagName('HOLIDAYS')[0]
        .getElementsByTagName('HOLIDAY');
      var hl=holidays.length;
      for (var h=0; h < hl; h++) {        var dt=holidays[h].firstChild ? holidays[h].firstChild.nodeValue : '';
        if (dt != '') {          var len=_holidays.length;
          _holidays[len]=dt;
        }
      }
      var highlight_days=project
        .getElementsByTagName('HIGHLIGHT_DAYS')[0]
        .getElementsByTagName('HIGHLIGHT_DAY');
      var hdl=highlight_days.length;
      for (var h=0; h < hdl; h++) {        var dt=highlight_days[h].firstChild
          ? highlight_days[h].firstChild.nodeValue
          : '';
        if (dt != '') {          var len=_highlight_days.length;
          _highlight_days[len]=dt;
        }
      }
      display_chart();
    }
    //ADD HOLIDAYS VALUE FOR PROJECT REFERENCING
    _projects[plen]['holidays']=[];
    var holidays=project
      .getElementsByTagName('HOLIDAYS')[0]
      .getElementsByTagName('HOLIDAY');
    var hl=holidays.length;
    for (var h=0; h < hl; h++) {      var dt=holidays[h].firstChild ? holidays[h].firstChild.nodeValue : '';
      if (dt != '') {        _projects[plen]['holidays'].push(dt);
      }
    }
    var parents=[];
    parents['meta']=$id('meta_data');
    parents['left']=$id('inner_list_wrapper');
    parents['right']=$id('task_box');
    var first_check =
      $id('project_ids').value.indexOf('MY') > -1 ? true : false;
    var second_check =
      $id('project_ids').value.split(',').length > 1 && any_filters() == true
        ? true
        : false;
    if (first_check || second_check) {      var my_projects_group_show=0;
      var my_projects_groups=project
        .getElementsByTagName('CHILDREN')[0]
        .getElementsByTagName('GROUP');
      var my_projects_groups_length=my_projects_groups.length;
      for (var mpg=0; mpg < my_projects_groups_length; mpg++) {        var child_counts =
          my_projects_groups[mpg].getElementsByTagName('CHILD_COUNT');
        var ccl=child_counts.length;
        for (var cc=0; cc < ccl; cc++) {          if (child_counts[cc].getAttribute('visible') != 0) {            my_projects_group_show++;
          }
        }
      }
    } else {      my_projects_group_show=1;
    }
    if (my_projects_group_show != 0) {      //SHOW THE PROJECT
      var project_targets=display_project(_projects[plen], parents);
      //GET PROJECT CHILDREN
      var children=projects[p].getElementsByTagName('CHILDREN')[0].childNodes;
      var children_length=children.length;
      for (var c=0; c < children_length; c++) {        if (children[c].tagName == 'GROUP') {          parse_group(children[c], project_targets, 0, c);
        }
      }
    }
  }
  //UPDATE PROJECT_IDS
  $id('loaded_project_ids').value=project_ids.join(',');
  //UPDATE COLUMNS
  hide_show_columns();
  //UPDATE GLOBALS
  _external_sync_projects=integrate_projects.join(',');
  if ($id('basecamp_sync_button')) {    if (_external_sync_projects.length > 0) {      $id('basecamp_sync_button').className='dropdown no_arrow';
    } else {      $id('basecamp_sync_button').className='hidden';
    }
  }
  var g_max=_groups.length;
  for (var g=0; g < g_max; g++) {    add_quick_add(_groups[g]['group_id']);
  }
  page_title += ' | TeamGantt';
  document.title=page_title;
  do_hide_groups(); //collapse hidden groups
  update_group_bar();
  focus_today(_middle_date); // focus the right date
  //UPDATE RESOUCE DD TEXT
  var resource_text_on='Filtered (!#)';
  var resource_text_off='Everyone';
  var resources_user=$id('user_resources_selected').value;
  var resources_company=$id('company_resources_selected').value;
  var resources_project=$id('custom_resources_selected').value;
  var clear_resource=$id('filters_resources_clear');
  var target_dd=$id('filter_resources');
  //var my_tasks_filter=$id("filter_resources_my_tasks");
  //CLEAR CLASSES
  target_dd.className=trim(target_dd.className.replace(/selected_red/g, ''));
  target_dd.className=trim(target_dd.className.replace(/selected/g, ''));
  //my_tasks_filter.className=trim(my_tasks_filter.className.replace(/selected_red/g,""));
  //my_tasks_filter.className=trim(my_tasks_filter.className.replace(/selected/g,""));
  if (
    resources_user == '' &&
    resources_company == '' &&
    resources_project == ''
  ) {    target_dd.className += ' selected';
    target_dd.firstChild.firstChild.nodeValue=resource_text_off;
    clear_resource.className=clear_resource.className += ' hidden';
  } else if (
    false &&
    resources_user == _user_num &&
    resources_company == '' &&
    resources_project == ''
  ) {    target_dd.firstChild.firstChild.nodeValue=resource_text_off;
    //my_tasks_filter.className += " selected selected_red";
  } else {    clear_resource.className=trim(
      clear_resource.className.replace(/hidden/g, '')
    );
    //FILTER COUNT
    var val =
      resources_user + ',' + resources_company + ',' + resources_project;
    var val1=val.split(',');
    var count=0;
    for (var i=0; i < val1.length; i++) {      if (val1[i] != '') {        count++;
      }
    }
    //FILL DROPDOWN TITLE
    if (count == 1) {      //IF ONE RESOURCE - SHOW THE NAME OF THE RESOURCE
      var resource_names=$id('filter_resources_dd_box').getElementsByTagName(
        'INPUT'
      );
      var rnl=resource_names.length;
      for (var r=0; r < rnl; r++) {        if (resource_names[r].checked == true) {          count=resource_names[r].parentNode.textContent;
        }
      }
    } else {      //IF MORE THAN ONE - SHOW HOW MANY ARE BEING SORTED
      count += count == 1 ? ' Resource' : ' Resources';
    }
    resource_text_on=resource_text_on.replace('!#', count);
    target_dd.firstChild.firstChild.nodeValue=resource_text_on;
    target_dd.className += ' selected selected_red';
  }
  //PERMISSIONS OF PROJECTS
  var any_admin=[];
  var any_edit=[];
  var enable_hours_estimating=false;
  var enable_time_tracking=false;
  var pl=_projects.length;
  for (var i=0; i < pl; i++) {    if (_projects[i]['project_permission'] == 'admin') {      var any_admin_length=any_admin.length;
      any_admin[any_admin_length]=i;
    }
    if (_projects[i]['project_permission'] == 'edit') {      var any_edit_length=any_edit.length;
      any_edit[any_edit_length]=i;
    }
    if (_projects[i]['project_enable_hours'] == 1) {      enable_hours_estimating=true;
    }
    if (_projects[i]['time_tracking'] == 1) {      enable_time_tracking=true;
    }
  }
  //PROJECTS LIST
  if (any_admin.length == 0) {    $id('project_settings_single').className='hidden';
    $id('project_settings_multiple').className='hidden';
    $id('invite_users_single')
      ? ($id('invite_users_single').className='hidden')
      : '';
    $id('invite_users_multiple')
      ? ($id('invite_users_multiple').className='hidden')
      : '';
    $id('invite_separator')
      ? ($id('invite_separator').className='hidden')
      : '';
    $id('invite_button').className='hidden';
    $id('save_as_template_single').className='hidden';
    $id('save_as_template_single').onclick=null;
    $id('save_as_template_multiple').className='hidden';
    remove_child_nodes($id('multiple_save_as_template'));
  } else if (any_admin.length == 1) {    $id('project_settings_single').className='option';
    $id('project_settings_multiple').className='hidden';
    $id('invite_users_single')
      ? ($id('invite_users_single').className='option')
      : '';
    $id('invite_users_multiple')
      ? ($id('invite_users_multiple').className='hidden')
      : '';
    $id('invite_separator')
      ? ($id('invite_separator').className='divider')
      : '';
    $id('invite_button').className='blue_button';
    var single=$id('project_settings_single');
    if (single) {      single.setAttribute('project_id', _projects[any_admin[0]]['project_id']);
      single.onclick=function () {        edit_project_info(this.getAttribute('project_id'));
        track_segment_event('gantt-clicked-project-settings-in-menu-dropdown');
      };
    }
    var single=$id('invite_users_single');
    if (single) {      single.setAttribute('project_id', _projects[any_admin[0]]['project_id']);
      single.onclick=function () {        document.getElementById('header_load_resources').click();
        track_segment_event(
          'gantt-clicked-manage-people-and-labels-in-menu-dropdown'
        );
      };
    }
    remove_child_nodes($id('multiple_projects_settings'));
    remove_child_nodes($id('multiple_projects_invite'));
    insert_share_footer_link();
    //SAVE AS TEMPLATE
    $id('save_as_template_single').className='option';
    $id('save_as_template_single').setAttribute(
      'project_id',
      _projects[any_admin[0]]['project_id']
    );
    $id('save_as_template_single').onclick=function () {      save_as_template(this.getAttribute('project_id'));
      track_segment_event('gantt-clicked-save-as-template-in-menu-dropdown');
    };
    $id('save_as_template_multiple').className='hidden';
    remove_child_nodes($id('multiple_save_as_template'));
  } else if (any_admin.length > 1) {    $id('project_settings_single').className='hidden';
    $id('project_settings_multiple').className='option multi';
    $id('invite_users_single')
      ? ($id('invite_users_single').className='option')
      : '';
    $id('invite_users_multiple')
      ? ($id('invite_users_multiple').className='hidden')
      : '';
    $id('invite_separator')
      ? ($id('invite_separator').className='divider')
      : '';
    $id('invite_button').className='blue_button';
    var single=$id('invite_users_single');
    if (single) {      single.setAttribute('project_id', _projects[any_admin[0]]['project_id']);
      single.onclick=function () {        document.getElementById('header_load_resources').click();
      };
    }
    remove_child_nodes($id('multiple_projects_settings'));
    remove_child_nodes($id('multiple_projects_invite'));
    remove_child_nodes($id('multiple_save_as_template'));
    var aal=any_admin.length;
    for (var i=0; i < aal; i++) {      if (_projects[any_admin[i]]['project_permission'] == 'admin') {        //SETTINGS
        var div=$create('DIV');
        div.className='option';
        div.setAttribute('project_id', _projects[any_admin[i]]['project_id']);
        div.onclick=function () {          edit_project_info(this.getAttribute('project_id'));
          track_segment_event(
            'gantt-clicked-project-settings-in-menu-dropdown'
          );
        };
        div.appendChild($text(_projects[any_admin[i]]['project_name']));
        $id('multiple_projects_settings').appendChild(div);
        //SAVE AS TEMPLATE
        var div=$create('DIV');
        div.className='option';
        div.setAttribute('project_id', _projects[any_admin[i]]['project_id']);
        div.onclick=function () {          save_as_template(this.getAttribute('project_id'));
          track_segment_event(
            'gantt-clicked-save-as-template-in-menu-dropdown'
          );
        };
        div.appendChild($text(_projects[any_admin[i]]['project_name']));
        $id('multiple_save_as_template').appendChild(div);
      }
    }
    insert_share_footer_link();
    //SAVE AS TEMPLATE
    $id('save_as_template_single').className='hidden';
    $id('save_as_template_single').setAttribute('project_id', '');
    $id('save_as_template_single').onclick=null;
    $id('save_as_template_multiple').className='option multi';
  }
  //TIME TRACKING
  if ($id('show_actual_hours_column_control')) {    if (enable_time_tracking == false) {      $id('show_actual_hours_column_control').style.display='none';
      $id('show_actual_hours_column').checked=false;
      $id('show_actual_hours_column_control').className=$id(
        'show_actual_hours_column_control'
      ).className.replace(/checked/g, '');
      hide_show_columns();
    } else {      $id('show_actual_hours_column_control').style.display='';
    }
  }
  //BASELINES
  if (any_edit.length == 0 && any_admin.length == 0) {    if ($id('create_new_baseline')) {      $id('create_new_baseline').className='hidden';
    }
  } else if (any_edit.length >= 1 || any_admin.length >= 1) {    if ($id('create_new_baseline')) {      $id('create_new_baseline').className='option';
    }
  }
  //MANAGE RESOURCES LIST
  if ($id('manage_resources_multiple')) {    var manage_resources_list=$id('multiple_projects_manage_resources');
    remove_child_nodes(manage_resources_list);
    var all_ids=[];
    var proj_length=_projects.length;
    for (var i=0; i < proj_length; i++) {      if (true || _projects[i]['project_permission'] == 'admin') {        var div=$create('DIV');
        div.className='option';
        div.setAttribute('project_id', _projects[i]['project_id']);
        div.appendChild($text(_projects[i]['project_name']));
        div.onclick=function () {          window.location =
            NEW_APP_URL +
            'projects/people?ids=' +
            this.getAttribute('project_id');
        };
        manage_resources_list.appendChild(div);
        all_ids.push(_projects[i]['project_id']);
      }
    }
    if (any_admin.length == 0) {      //PREVIOUS DIVIDER IS NOT NEEDED
      $id('manage_resources_single').previousSibling.previousSibling.className =
        'hidden';
      $id('manage_resources_single').className='hidden';
      $id('manage_resources_single').onclick=null;
      $id('manage_resources_multiple').className='hidden';
      $id('manage_resources_multiple').onclick=null;
    } else {      if (_projects.length > 1) {        $id('manage_resources_single').className='hidden';
        $id('manage_resources_single').onclick=null;
        $id('manage_resources_multiple').className='option multi';
      } else {        var div=$id('manage_resources_single');
        div.className='option';
        div.onclick=function () {          navigate_window(
            NEW_APP_URL + 'projects/people?ids=' + _projects[0]['project_id']
          );
        };
        $id('manage_resources_multiple').className='hidden';
      }
      //PREVIOUS DIVIDER
      $id('manage_resources_single').previousSibling.previousSibling.className =
        'divider';
    }
  }}
function save_as_template(project_id) {  update_target('project', project_id, {is_template: true});
  _projects[_projects_key[project_id]]['project_template']='1';
  custom_alert(
    'This project is now marked as a template. To adjust this setting, go to Menu > Project Settings.'
  );
}
function parse_group(group_node, group_parents, indent, index) {  //ADD GROUP
  var glen=_groups.length;
  var ids=group_node.getElementsByTagName('IDS')[0];
  _groups[glen]=[];
  _groups[glen]['group_id']=ids.getAttribute('group');
  _groups[glen]['parent_group_id']=ids.getAttribute('parent');
  _groups[glen]['project_id']=ids.getAttribute('project');
  _groups[glen]['group_name']=getNodeValue(group_node, 'NAME');
  _groups[glen]['group_hidden']=group_node.getAttribute('is_hidden');
  _groups[glen]['sort_order']=index + 1;
  _groups[glen]['child_count']=getNodeValue(group_node, 'CHILD_COUNT');
  _groups[glen]['min_date']='';
  _groups[glen]['max_date']='';
  _groups[glen]['duration']='';
  _groups[glen]['total_days']=0;
  _groups[glen]['completed_days']=0;
  _groups[glen]['estimated_hours']=0;
  _groups[glen]['indent']=indent;
  //DOCUMENTS * COMMENTS
  var temp_comment_group=group_node.getElementsByTagName('COMMENT')[0];
  _groups[glen]['comment_count']=temp_comment_group.getAttribute('count');
  _groups[glen]['comment_edit_date']=temp_comment_group.getAttribute('date');
  _groups[glen]['user_comment_edit_date'] =
    temp_comment_group.getAttribute('user');
  var temp_document=group_node.getElementsByTagName('DOCUMENT')[0];
  _groups[glen]['document_count']=temp_document.getAttribute('count');
  _groups[glen]['document_edit_date']=temp_document.getAttribute('date');
  _groups[glen]['user_document_edit_date']=temp_document.getAttribute('user');
  //IF BEING ACCESSED BY A PUBLIC KEY -- SET THE COUNTS TO THE SAME SO THEY DON'T SHOW THE NEW ICON
  var PROJECT_ID=ids.getAttribute('project');
  if (
    _projects[_projects_key[PROJECT_ID]]['public_key'] ==
    _projects[_projects_key[PROJECT_ID]]['user_public_key']
  ) {    _groups[glen]['user_comment_edit_date'] =
      _groups[glen]['comment_edit_date'];
    _groups[glen]['user_document_edit_date'] =
      _groups[glen]['document_edit_date'];
  }
  //VISIBLITY OF GROUP
  var is_visible1=group_node.getElementsByTagName('CHILD_COUNT');
  var is_visible_length=is_visible1.length - 1;
  var is_visible=is_visible1[is_visible_length].getAttribute('visible');
  _groups[glen]['visible']=is_visible == 0 ? false : true;
  var PROJECT_ID=ids.getAttribute('project');
  _groups[glen]['editable'] =
    _projects[_projects_key[PROJECT_ID]]['disabled'] == 0 &&
    (_projects[_projects_key[PROJECT_ID]]['project_permission'] == 'admin' ||
      _projects[_projects_key[PROJECT_ID]]['project_permission'] == 'edit')
      ? true
      : false;
  _groups_key[ids.getAttribute('group')]=glen;
  //SHOW GROUP
  var group_targets=display_group(_groups[glen], group_parents, indent);
  if (_version == 'gantt_chart') {    group_targets['meta']=group_targets[1];
    group_targets['left']=group_targets[3];
    group_targets['right']=group_targets[5];
  }
  //CHILDREN
  var children=group_node.getElementsByTagName('CHILDREN')[0].childNodes;
  var children_length=children.length;
  for (var c=0; c < children_length; c++) {    if (children[c].tagName == 'GROUP') {      parse_group(children[c], group_targets, indent * 1 + 1, c);
    } else if (children[c].tagName == 'TASK') {      parse_task(children[c], group_targets, c);
    }
  }}
function parse_task(node, group_targets, index) {  var tlen=_tasks.length;
  var ids=node.getElementsByTagName('IDS')[0];
  var timeline=node.getElementsByTagName('TIMELINE')[0];
  var time_tracking=node.getElementsByTagName('TIME_TRACKING')[0];
  _tasks_key[ids.getAttribute('task')]=tlen;
  _tasks[tlen]=[];
  _tasks[tlen]['task_id']=ids.getAttribute('task');
  _tasks[tlen]['project_id']=ids.getAttribute('project');
  _tasks[tlen]['group_id']=ids.getAttribute('group');
  _tasks[tlen]['task_name']=getNodeValue(node, 'NAME');
  _tasks[tlen]['start_date']=timeline.getAttribute('start');
  _tasks[tlen]['end_date']=timeline.getAttribute('end');
  _tasks[tlen]['percent_complete']=timeline.getAttribute('percent');
  _tasks[tlen]['weeks']=timeline.getAttribute('weeks');
  _tasks[tlen]['days']=timeline.getAttribute('days');
  _tasks[tlen]['completed_days']=timeline.getAttribute('completed');
  _tasks[tlen]['total_days']=timeline.getAttribute('total');
  _tasks[tlen]['estimated_hours']=node.getAttribute('estimated_hours');
  _tasks[tlen]['assigned_hours']=0;
  _tasks[tlen]['task_type']=node.getAttribute('type');
  _tasks[tlen]['color']=node.getAttribute('color');
  _tasks[tlen]['editable']=node.getAttribute('editable');
  _tasks[tlen]['has_time']=time_tracking.getAttribute('has_time');
  _tasks[tlen]['punched_in']=time_tracking.getAttribute('punched_in');
  _tasks[tlen]['user_punched_in'] =
    time_tracking.getAttribute('user_punched_in');
  _tasks[tlen]['sort_order']=index + 1;
  var actual_hours=format_time(time_tracking.getAttribute('actual_hours'))[
    'decimal'
  ];
  actual_hours=actual_hours == 0 ? '' : actual_hours;
  _tasks[tlen]['actual_hours']=actual_hours;
  //var is_visible=getNodeValue(node, "VISIBLE");
  var is_visible=node.getElementsByTagName('VISIBLE')[0].getAttribute('is');
  _tasks[tlen]['show_task']=is_visible == 1 ? true : false;
  var PROJECT_ID=ids.getAttribute('project');
  //DISABLED OVERRIDE
  if (_projects[_projects_key[PROJECT_ID]]['disabled'] == 1) {    _tasks[tlen]['editable']=0;
  }
  var temp_comment=node.getElementsByTagName('COMMENT')[0];
  _tasks[tlen]['comment_count']=temp_comment.getAttribute('count');
  _tasks[tlen]['comment_edit_date']=temp_comment.getAttribute('date');
  _tasks[tlen]['user_comment_edit_date']=temp_comment.getAttribute('user');
  var temp_document=node.getElementsByTagName('DOCUMENT')[0];
  _tasks[tlen]['document_count']=temp_document.getAttribute('count');
  _tasks[tlen]['document_edit_date']=temp_document.getAttribute('date');
  _tasks[tlen]['user_document_edit_date']=temp_document.getAttribute('user');
  var temp_checklist=node.getElementsByTagName('CHECKLIST')[0];
  _tasks[tlen]['checklist_count']=temp_checklist.getAttribute('count');
  _tasks[tlen]['checklist_completed'] =
    temp_checklist.getAttribute('completed');
  //IF BEING ACCESSED BY A PUBLIC KEY -- SET THE COUNTS TO THE SAME SO THEY DON'T SHOW THE NEW ICON
  if (
    _projects[_projects_key[PROJECT_ID]]['public_key'] ==
    _projects[_projects_key[PROJECT_ID]]['user_public_key']
  ) {    _tasks[tlen]['user_comment_edit_date']=_tasks[tlen]['comment_edit_date'];
    _tasks[tlen]['user_document_edit_date'] =
      _tasks[tlen]['document_edit_date'];
  }
  //RESOURES
  var user_resources=[];
  var custom_resources=[];
  var task_resources=[];
  var resources=node.getElementsByTagName('RESOURCES')[0];
  var u_resources=resources.getElementsByTagName('USER');
  var c_resources=resources.getElementsByTagName('CUSTOM');
  var comp_resources=resources.getElementsByTagName('COMPANY');
  var user_resource_ids=[];
  var company_resource_ids=[];
  var custom_resource_ids=[];
  //USER RESOURCES
  var u_len=u_resources.length;
  for (var u=0; u < u_len; u++) {    if (u_resources[u]) {      var resource_id=u_resources[u].getAttribute('id');
      var hours_per_day=u_resources[u].getAttribute('hours_per_day');
      var total_hours=u_resources[u].getAttribute('total_hours');
      var assigned_id=u_resources[u].getAttribute('assigned_id');
      var resource_name=pull_resource('user', resource_id);
      var tr_len=task_resources.length;
      task_resources[tr_len]=resource_name;
      var resource_details=[];
      resource_details['resource_id']=resource_id;
      resource_details['hours_per_day']=hours_per_day;
      resource_details['total_hours']=total_hours;
      resource_details['assigned_id']=assigned_id;
      //SUM UP ASSIGNED HOURS
      _tasks[tlen]['assigned_hours'] += total_hours * 1;
      user_resource_ids[resource_id]=resource_details;
    }
  }
  //COMPANY RESOURCES
  var c_len=comp_resources.length;
  for (var c=0; c < c_len; c++) {    if (comp_resources[c]) {      var resource_id=comp_resources[c].getAttribute('id');
      var hours_per_day=comp_resources[c].getAttribute('hours_per_day');
      var total_hours=comp_resources[c].getAttribute('total_hours');
      var assigned_id=comp_resources[c].getAttribute('assigned_id');
      var resource_name=pull_resource('company', resource_id);
      var tr_len=task_resources.length;
      task_resources[tr_len]=resource_name;
      var resource_details=[];
      resource_details['resource_id']=resource_id;
      resource_details['hours_per_day']=hours_per_day;
      resource_details['total_hours']=total_hours;
      resource_details['assigned_id']=assigned_id;
      //SUM UP ASSIGNED HOURS
      _tasks[tlen]['assigned_hours'] += total_hours * 1;
      company_resource_ids[resource_id]=resource_details;
      var ele=$id('resource_custom_' + resource_id);
    }
  }
  //CUSTOM RESOURCES
  var cs_len=c_resources.length;
  for (var c=0; c < cs_len; c++) {    if (c_resources[c]) {      var resource_id=c_resources[c].getAttribute('id');
      var hours_per_day=c_resources[c].getAttribute('hours_per_day');
      var total_hours=c_resources[c].getAttribute('total_hours');
      var assigned_id=c_resources[c].getAttribute('assigned_id');
      var resource_name=pull_resource('custom', resource_id);
      var tr_len=task_resources.length;
      task_resources[tr_len]=resource_name;
      var resource_details=[];
      resource_details['resource_id']=resource_id;
      resource_details['hours_per_day']=hours_per_day;
      resource_details['total_hours']=total_hours;
      resource_details['assigned_id']=assigned_id;
      //SUM UP ASSIGNED HOURS
      _tasks[tlen]['assigned_hours'] += total_hours * 1;
      custom_resource_ids[resource_id]=resource_details;
      var ele=$id('resource_custom_' + resource_id);
    }
  }
  _tasks[tlen]['assigned_hours'] =
    Math.round(_tasks[tlen]['assigned_hours'] * 100) / 100;
  task_resources.sort();
  _tasks[tlen]['resources']=task_resources;
  _tasks[tlen]['user_resources']=user_resource_ids;
  _tasks[tlen]['company_resources']=company_resource_ids;
  _tasks[tlen]['custom_resources']=custom_resource_ids;
  //EDIT PROGRESS ON A TASK
  _tasks[tlen]['edit_percent']=0;
  if (
    _projects[_projects_key[_tasks[tlen]['project_id']]][
      'project_permission'
    ] == 'own_progress' &&
    _tasks[tlen]['user_resources'][_user_num] != undefined &&
    _projects[_projects_key[_tasks[tlen]['project_id']]]['disabled'] == 0
  ) {    _tasks[tlen]['edit_percent']=1;
  }
  //CRITICAL PATHS
  var cp_text='';
  var cps=node.getElementsByTagName('PATHS')[0];
  var paths=cps.getElementsByTagName('TO');
  var paths_length=paths.length;
  var cp_data=[];
  if (paths_length > 0) {    for (var pths=0; pths < paths_length; pths++) {      var path=paths[pths];
      cp_text += cp_text == '' ? '' : ',';
      cp_text += path.getAttribute('to');
      cp_data.push({        id: path.getAttribute('id'),
        to_task_id: path.getAttribute('to'),
      });
    }
  }
  _tasks[tlen]['critical_paths']=cp_text != '' ? cp_text.split(',') : [];
  _tasks[tlen]['critical_paths_data']=cp_data;
  var tasks=display_tasks(_tasks[tlen], group_targets);
}
function display_chart() {  if (_need_refresh == 1) {    load_gantt();
  } else {    if (_version == 'gantt_chart') {      var target=$id('gantt_location');
      build_frame();
      var meta_data=$id('meta_data');
      var wrapper=$id('inner_list_wrapper');
      var tasks=$id('task_box');
      var day_width=_day_width[$id('zoom').value];
      var height_div=$create('DIV');
      height_div.id='hidden_row_height';
      $id('category_task_list').appendChild(height_div);
      if (_left_width != '') {        adjust_left_panel_width(_left_width);
      }
      if (_loads == 0) {        _loads++;
      }
      setTimeout(check_scroll, 10);
      setTimeout(set_scroll_bar, 100);
      check_scroll();
      match_scrolls();
      addListener($id('tasks'), 'scroll', match_scrolls, false);
    } else if (_version == 'list_view') {      remove_child_nodes($id('list_view'));
    }
  }}
/*********************************************************************************************************************************************************************
BUILD CHART DATA
*********************************************************************************************************************************************************************/
function build_frame() {  var target=$id('gantt_location');
  remove_child_nodes(target);
  var zoom=$id('zoom').value;
  var task_header=$create('DIV');
  task_header.id='task_header';
  task_header.className=zoom;
  target.appendChild(task_header);
  var gantt_chart=$create('DIV');
  gantt_chart.id='gantt_chart';
  gantt_chart.style.fontSize=$id('font_size').value + 'px';
  gantt_chart.className='font' + $id('font_size').value + ' ' + zoom;
  target.appendChild(gantt_chart);
  //TASK META (DOCUMENTS NOTES COMMENTS)
  if (_has_meta == true) {    var meta_data=$create('DIV');
    meta_data.id='meta_data';
    meta_data.className='';
    gantt_chart.appendChild(meta_data);
  }
  //LEFT PANEL
  var list=$create('DIV');
  list.id='category_task_list';
  gantt_chart.appendChild(list);
  var wrapper=$create('DIV');
  wrapper.id='category_task_list_wrapper';
  list.appendChild(wrapper);
  var inner_wrapper=$create('DIV');
  inner_wrapper.id='inner_list_wrapper';
  inner_wrapper.className='task_wrapper';
  wrapper.appendChild(inner_wrapper);
  var resize_bar=$create('DIV');
  resize_bar.id='resize_bar';
  resize_bar.onmousedown=function () {    start_move('left_panel');
    track_segment_event('gantt-resized-name-column');
  };
  resize_bar.title=_titles['list_resize'];
  gantt_chart.appendChild(resize_bar);
  //RIGHT PANEL
  var tasks=$create('DIV');
  tasks.id='tasks';
  tasks.style.position='relative';
  gantt_chart.appendChild(tasks);
  //BACKGROUND LINES
  var bg_lines=$create('DIV');
  bg_lines.id='background_lines';
  tasks.appendChild(bg_lines);
  //SHOW THE MONTH & DAY LINES
  build_days(_min_date, _max_date, bg_lines);
  var task_wrapper=$create('DIV');
  task_wrapper.id='task_box';
  task_wrapper.className='task_wrapper';
  task_wrapper.style.position='relative';
  task_wrapper.style.top=0;
  task_wrapper.style.left=0;
  task_wrapper.style.width=_full_width + 'px';
  task_wrapper.style.maxWidth=_full_width + 'px';
  tasks.appendChild(task_wrapper);
  var cancel_clicker=$create('DIV');
  cancel_clicker.id='cancel_clicker';
  cancel_clicker.className='hidden';
  task_wrapper.appendChild(cancel_clicker);
  var cp_wrapper=$create('DIV');
  cp_wrapper.id='critical_paths';
  cp_wrapper.position='absolute';
  cp_wrapper.style.top=0;
  cp_wrapper.style.left=0;
  cp_wrapper.style.width=_full_width + 'px';
  tasks.appendChild(cp_wrapper);
  var utility_box=$create('DIV');
  utility_box.id='utility_box';
  utility_box.position='absolute';
  utility_box.style.top=0;
  utility_box.style.left=0;
  utility_box.style.width=_full_width + 'px';
  tasks.appendChild(utility_box);
}
//DEFINE GLOBAL VARIABLES
var month_left=0;
var day_left=null;
var last_dow=null;
var first_day=null;
function reset_public_days() {  month_left=0;
  day_left=null;
  last_dow=null;
  first_day=null;
}
function build_days(min_date, max_date, target) {  reset_public_days();
  //MOVING BACKGROUND
  var mv_bg=$create('DIV');
  mv_bg.id='move_bg';
  mv_bg.className='hidden';
  $id('background_lines').appendChild(mv_bg);
  var dates=$create('DIV');
  dates.id='move_dates';
  dates.className='hidden';
  var start=$create('DIV');
  start.id='mover_start';
  dates.appendChild(start);
  var finish=$create('DIV');
  finish.id='mover_end';
  dates.appendChild(finish);
  $id('background_lines').appendChild(dates);
  if (min_date == null) {    var m_date=new Date();
    min_date =
      m_date.getFullYear() + '-' + m_date.getMonth() + '-' + m_date.getDate();
  }
  if (max_date == null) {    var m_date=new Date();
    max_date =
      m_date.getFullYear() + '-' + m_date.getMonth() + '-' + m_date.getDate();
  }
  //GET VALUES
  var min_time=min_date.split('-');
  var min_year=min_time[0] * 1;
  var min_month=min_time[1] * 1;
  var max_time=max_date.split('-');
  var max_year=max_time[0] * 1;
  var max_month=max_time[1] * 1;
  var day_width=_day_width[$id('zoom').value];
  var header=$id('task_header');
  remove_child_nodes(header);
  //LOOP THROUGH THE MONTHS
  var extensions=6; // how many months to add on each end of the gantt
  var insert_before_duration=_force_cal_start ? 0 : 2; // how many months to add before each chart.
  var temp_min=new Date(min_year, min_month - insert_before_duration - 1, 1);
  var year=temp_min.getFullYear();
  var month=temp_min.getMonth() * 1 + 1;
  var left=0;
  var left_over_runs=extensions;
  left_over_runs++;
  var runs=left_over_runs * 2;
  while (month <= max_month || year < max_year || runs <= left_over_runs) {    var data=display_month(month, year);
    left=data[0];
    //FOR NEXT LOOP
    if (month != 12) {      month++;
    } else {      month=1;
      year++;
    }
    //SET RUNS TO 0 ONCE MAX DATE HAS ARRIVED
    if (month >= max_month && year >= max_year && runs > left_over_runs) {      runs=0;
      max_month=-1000;
      max_year=-1000;
    }
    runs++;
  }
  //CLOSING LINE
  var div=$create('DIV');
  div.className='month_lines';
  div.style.marginLeft=day_left * 1 + day_width + 'px';
  div.style.width=0 + 'px';
  div.style.overflow='visible';
  $id('background_lines').appendChild(div);
  //SPACER
  var spacer=$create('DIV');
  spacer.id='spacer';
  spacer.className='task_months';
  var spacer_inner=$create('DIV');
  spacer_inner.style.textAlign='right';
  //TABS
  var spacer_tabs=[
    ['percent_complete', 'Progress'],
    ['assigned_resources', 'Assigned'],
    ['actual_hours', 'Actual Hrs'],
    ['estimated_hours', 'Est. Hours'],
  ];
  for (var s in spacer_tabs) {    var tab=spacer_tabs[s];
    var div=$create('DIV');
    div.className='spacer_tab ' + tab[0];
    div.id='spacer_tab_' + tab[0];
    div.appendChild($text(tab[1]));
    spacer_inner.appendChild(div);
    //TAB SELECTOR
    var tab_selector=$create('DIV');
    tab_selector.className='tab_selector';
    tab_selector.onclick=function () {      open_tab_dropdown(this);
    };
    div.appendChild(tab_selector);
  }
  //TAB SELECTOR OVER THE TASK NAME COLUMN
  var top_space=$create('DIV');
  top_space.id='task_name_column_spacer';
  top_space.style.position='absolute';
  top_space.style.top=0;
  top_space.style.height='1.75em';
  spacer.appendChild(top_space);
  var top_mover=$create('DIV');
  top_mover.id='task_name_header_resizer';
  top_mover.onmousedown=function () {    start_move('left_panel');
  };
  top_space.appendChild(top_mover);
  //TAB SELECTOR
  var tab_selector=$create('DIV');
  tab_selector.className='tab_selector';
  tab_selector.onclick=function () {    open_tab_dropdown(this);
  };
  top_space.appendChild(tab_selector);
  spacer.appendChild(spacer_inner);
  $id('task_header').appendChild(spacer);
  if (header.lastChild.previousSibling) {    left=left + header.lastChild.previousSibling.offsetWidth - 5;
    update_header_width(left);
  }}
function open_tab_dropdown(ele) {  var pos=real_position(ele);
  var left=pos.x;
  left += sidebar_width();
  var top=pos.y - get_scrolltop();
  if (ele.parentNode.id == 'task_name_column_spacer') {    top += 40;
  }
  var target=$id('tab_selector_options');
  target.style.left=left + 'px';
  target.style.top=top + 'px';
  target.className='';
  var opts=$id('details_column_view_checkboxes');
  target.appendChild(opts);
  var background_div=build_background_cover();
  background_div.style.background='none';
  background_div.onclick=function () {    $id('tab_selector_options').className='hidden';
    hide_backdrop();
    allow_hover=true;
  };
}
function update_header_width(width) {  _full_width=width;
  if ($id('utility_box')) {    $id('task_box').style.width=_full_width + 'px';
    $id('task_box').style.maxWidth=_full_width + 'px';
    $id('critical_paths').style.width=_full_width + 'px';
    $id('utility_box').style.width=_full_width + 'px';
  }}
function add_month() {  var divs=$id('background_lines').getElementsByTagName('DIV');
  var last=null;
  for (var i=divs.length - 1; i >= 0; i--) {    if (
      divs[i].getAttribute('date') != 'undefined' &&
      divs[i].getAttribute('date') != null
    ) {      var last=divs[i].getAttribute('date');
      var i=-1;
    }
  }
  if (last != null && last != '') {    var date_break=last.split('-');
    var year=date_break[0] * 1;
    var month=date_break[1] * 1;
    month++;
    if (month == 13) {      year++;
      month=1;
    }
    display_month(month, year);
    adjust_left_panel_width(_left_width * 1);
    set_scroll_bar();
    set_scroll_bar();
    set_scroll_bar();
    set_arrows();
  }}
function display_month(month, year) {  var header=$id('task_header');
  var today_date=new Date();
  var today_year=today_date.getFullYear();
  var today_month=today_date.getMonth();
  var today_day=today_date.getDate();
  var day_width=find_day_width();
  const is_week_view=day_width <= _day_width['w120'];
  var months=new Array(
    'January',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  );
  if (day_width <= _day_width['w100']) {    var months=new Array(
      'Jan',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    );
  }
  var month_width=0;
  var days_in_month=32 - new Date(year, month - 1, 32).getDate();
  month_left=day_left;
  //LIST THE DAYS
  var has_month_line=false;
  var tomorrow_is=null;
  for (var d=1; d <= days_in_month; d++) {    var dt=new Date(year, month - 1, d, 0, 0, 0, 0);
    var dow=dt.getDay();
    var is_today=false;
    if (
      dt.getFullYear() == today_year &&
      dt.getMonth() == today_month &&
      dt.getDate() == today_day
    ) {      is_today=true;
    }
    var day_hidden=false;
    if (
      js_in_array(dow, _chart_days) == -1 ||
      js_in_array(year + '-' + month + '-' + d, _holidays) > -1 ||
      js_in_array('*-' + month + '-' + d, _holidays) > -1
    ) {      day_hidden=true;
    } else {      day_left=day_left == null ? 0 : day_left * 1 + day_width;
    }
    day_left=day_left == null ? 0 : day_left;
    if (first_day == null && day_hidden == false) {      day_left=2;
      first_day='used';
    }
    //FOR LINE ID
    var line_year=year;
    var line_month=month * 1;
    line_month=line_month < 10 ? '0' + line_month : line_month;
    var line_day=d;
    line_day=line_day < 10 ? '0' + line_day : line_day;
    var date_id=[line_year, line_month, line_day].join('');
    var div=$create('DIV');
    div.className=d == 1 && day_hidden == false ? 'month_lines' : 'day_lines';
    div.style.marginLeft=day_left + 'px';
    div.style.width=day_width * 1 + 'px';
    div.style.overflow='visible';
    div.id='line_' + date_id;
    div.setAttribute('var_left', day_left);
    if (day_hidden == false) {      div.setAttribute('date', line_year + '-' + line_month + '-' + line_day);
      if ($id('gantt_start_date').value == '') {        $id('gantt_start_date').value =
          line_year + '-' + line_month + '-' + line_day;
      }
      $id('gantt_end_date').value =
        line_year + '-' + line_month + '-' + line_day;
    }
    $id('background_lines').appendChild(div);
    const is_first_day_of_month =
      d < 7 && day_hidden == false && has_month_line == false;
    const is_first_day_of_week =
      dow <= last_dow && last_dow != null && day_hidden == false;
    var div2=$create('DIV');
    div2.className='task_month_day_day';
    div2.id='header_line_' + date_id;
    var div2_children=$fragment();
    var div2_day_num=$create('span');
    div2_day_num.className='task_month_day_day__number';
    div2_children.appendChild(div2_day_num);
    var div2_day_label=$create('span');
    div2_day_label.className='task_month_day_day__label';
    div2_children.appendChild(div2_day_label);
    const show_day_number =
      !is_week_view || (is_week_view && is_first_day_of_week);
    const show_day_letter=!is_week_view;
    if (show_day_number) {      div2_day_num.appendChild($text(d));
    }
    if (show_day_letter) {      div2_day_label.appendChild($text(pretty_day(dt).charAt(0)));
    }
    if (is_week_view && !is_first_day_of_week) {      div2.style.zIndex=999;
    }
    div2.appendChild(div2_children);
    div2.style.marginLeft=day_left + 'px';
    div2.style.width=day_width + 'px';
    $id('background_lines').appendChild(div2);
    //ADDITIONAL DAY CLASS VALUES
    var highlight_day =
      js_in_array(year + '-' + month + '-' + d, _highlight_days) > -1 ||
      js_in_array('*-' + month + '-' + d, _highlight_days) > -1
        ? true
        : false;
    if (is_today == true) {      // if today and not hidden - style for today
      if (day_hidden == false) {        div.className += ' today_line';
        tomorrow_is='next';
        div2.id='today_line';
        div2.className='task_month_day_day today_line';
      }
      if (day_hidden == true) {        div.style.borderRight='3px #e3d7b6 solid';
      }
    } else {      // only for day and day+ view
      if (
        (dow == 0 || dow == 6 || highlight_day == true) &&
        day_hidden == false
      ) {        // add weekend classes if the day is visible and a weekend
        div.className += ' weekend_bg';
        div2.className='task_month_day_day task_month_weekend';
      } // or style it as just a normal day
      else {        div2.className += ' task_month_weekday';
      }
      if (tomorrow_is == 'next' && day_hidden == false) {        tomorrow_is=null;
        div.className += ' today_line_right_edge';
        div2.className += ' today_line_right_edge';
      }
    }
    if (day_hidden == true) {      div.style.borderLeft='none';
      div.style.zIndex=-1;
      div.setAttribute('is_hidden', true);
    }
    //FOR FIRST DAY OF THE MONTH -- DRAW THE LINE
    if (is_first_day_of_month) {      div.className += ' month_lines';
      div2.className += ' month_lines';
      has_month_line=true;
    }
    //IF THE BEGINNING OF A NEW WEEK
    if (is_first_day_of_week) {      if (
        day_width >= _day_width['d80'] &&
        (js_in_array(0, _chart_days) == -1 || js_in_array(6, _chart_days) == -1)
      ) {        // if day or day+ view style the border to be darker
        div.className += ' new_week_line';
        div2.className += ' new_week_line';
      }
    } // if it's a regular day
    else {      if (day_width < _day_width['d80']) {        // if any of the week or month views remove the border left
        div.style.borderLeft='none';
        div2.style.borderLeft='none';
      }
    }
    //MONTH WIDTH VALUES
    if (day_hidden == false) {      // if day isn't hidden, add it to the month view
      month_width += day_width;
    } // if day his hidden -- don't add to month_width and remove values to hide it
    else {      div2.style.visibility='hidden';
      if (is_today == false) {        div2.style.zIndex='-100';
        div2.style.visibility='hidden';
        div.className='task_month_day_day';
      } else {        div.style.zIndex=100;
      }
    }
    //UPDATE THE LAST DAY OF THE WEEK SHOWN (used for the begining of a new week)
    last_dow=day_hidden == false ? dow : last_dow;
  }
  //MONTH LIST
  var div=$create('DIV');
  div.className='task_months';
  div.style.width=month_width * 1 + 'px';
  div.setAttribute('var_width', month_width);
  div.id='month_' + month + '_' + year;
  var span=$create('SPAN');
  span.appendChild($text(months[month] + ' ' + year));
  div.appendChild(span);
  //INSERT THE DIV
  if ($id('spacer')) {    header.insertBefore(div, $id('spacer'));
  } else {    header.appendChild(div);
  }
  var left=div.previousSibling
    ? div.previousSibling.getAttribute('def_left') * 1 +
      div.previousSibling.getAttribute('var_width') * 1
    : 2;
  div.style.marginLeft=left + 'px';
  div.setAttribute('var_left', left);
  div.setAttribute('def_left', left);
  //UPDATE THE HEADER WIDTH
  update_header_width(left * 1 + month_width);
  return [left];
}
function find_position(start_date, end_date, day_width) {  start_date=start_date == null ? '' : start_date;
  end_date=end_date == null ? '' : end_date;
  var start_date_text=start_date.toString().replace(/-/g, '');
  var end_date_text=end_date.toString().replace(/-/g, '');
  if ($id('line_' + start_date_text) && $id('line_' + end_date_text)) {    var left=$id('line_' + start_date_text).getAttribute('var_left');
    var right =
      $id('line_' + end_date_text).getAttribute('var_left') * 1 + day_width;
    var width=right - left - 1;
    var is_hidden=false;
    if ($id('line_' + start_date_text).getAttribute('is_hidden') == 'true') {      is_hidden=true;
    }
    return [left, width, is_hidden];
  } else {    return [0, 0];
  }}
function hide_group_control(group_id) {  var ele=$id('category_title_' + group_id) || $id('category_' + group_id);
  if (
    ele.getAttribute('group_hidden') == 1 ||
    ele.getAttribute('group_hidden') == 2
  ) {    ele.setAttribute('group_hidden', 0);
    hide_group(group_id, 0);
    if (ele.getAttribute('def_hidden') != 2) {      save_value('group-hide', group_id, '');
    }
    if ($id('group_arrow_' + group_id)) {      $id('group_arrow_' + group_id).title=_titles['list_group_collapse1'];
    }
    if ($id('group_chart_arrow_' + group_id)) {      $id('group_chart_arrow_' + group_id).title =
        _titles['list_group_collapse1'];
    }
  } else {    ele.setAttribute('group_hidden', 1);
    hide_group(group_id, 1);
    if (ele.getAttribute('def_hidden') != 2) {      save_value('group-hide', group_id, 1);
    }
    if ($id('group_arrow_' + group_id)) {      $id('group_arrow_' + group_id).title=_titles['list_group_collapse2'];
    }
    if ($id('group_chart_arrow_' + group_id)) {      $id('group_chart_arrow_' + group_id).title =
        _titles['list_group_collapse2'];
    }
  }
  load_critical_paths();
  set_scroll_bar();
  check_scroll();
}
function do_hide_groups() {  //HIDE GROUPS THAT NEED TO BE HIDDEN
  var group_len=_groups.length;
  for (var g=0; g < group_len; g++) {    var group_id=_groups[g]['group_id'];
    var group_hidden=_groups[g]['group_hidden'];
    hide_group(group_id, group_hidden);
  }}
function hide_group(group_id, hide_which) {  //hide_which=1 means it just hides the tasks
  //hide_which=2 means it hides both the tasks and the group bar
  if (_version == 'gantt_chart') {    if (_has_meta == true) {      var group_meta=$id('category_meta_' + group_id);
      var group_meta_target=$id('category_meta_target_' + group_id);
    }
    var group_title=$id('category_title_' + group_id);
    var group_target=$id('group_target_' + group_id); // the tasks
    var group_arrow=$id('group_arrow_' + group_id);
    var group_chart_arrow=$id('group_chart_arrow_' + group_id);
    var group_space=$id('category_details_' + group_id); // the tasks
    var group_space_target=$id('group_space_target_' + group_id); // the tasks
    var group_bar=$id('category_' + group_id);
    var group_bar_target=$id('group_bar_target_' + group_id); //the tasks
    if (hide_which == 0 || hide_which == '') {      if (_has_meta == true) {        group_meta.style.display='';
        group_meta_target.style.display='';
        group_meta_target.style.height='';
        group_meta_target.style.overflow='';
      }
      group_title.style.display='';
      group_target.style.display='';
      group_target.style.height='';
      group_target.style.overflow='';
      group_arrow.className='tg-icon triangle-down';
      group_chart_arrow.className='tg-icon triangle-down';
      group_bar.style.display='';
      group_bar_target.style.display='';
      group_bar_target.style.height='';
      group_bar_target.style.overflow='';
      group_title.setAttribute('group_hidden', 0);
      group_bar_target.setAttribute('group_hidden', 0);
      _groups[_groups_key[group_id]]['group_hidden']='';
    } else if (hide_which == 1) {      if (_has_meta == true) {        group_meta.style.display='';
        group_meta_target.style.display='';
        group_meta_target.style.height=0;
        group_meta_target.style.overflow='hidden';
      }
      group_title.style.display='';
      group_target.style.display='';
      group_target.style.height=0;
      group_target.style.overflow='hidden';
      group_arrow.className='tg-icon triangle-right';
      group_chart_arrow.className='tg-icon triangle-right';
      group_bar.style.display='';
      group_bar_target.style.display='';
      group_bar_target.style.height=0;
      group_bar_target.style.overflow='hidden';
      group_title.setAttribute('group_hidden', 1);
      group_bar_target.setAttribute('group_hidden', 1);
      _groups[_groups_key[group_id]]['group_hidden']=1;
    }
  } else if (_version == 'list_view') {    var group_target=$id('category_target_' + group_id);
    var group_arrow=$id('group_arrow_' + group_id);
    if (hide_which == 0 || hide_which == '') {      group_target.className='';
      group_target.setAttribute('group_hidden', 0);
      group_arrow.className='collapse_arrow arrow_down';
      _groups[_groups_key[group_id]]['group_hidden']='';
    } else {      group_target.className='hidden';
      group_target.setAttribute('group_hidden', 1);
      group_arrow.className='collapse_arrow arrow_right';
      _groups[_groups_key[group_id]]['group_hidden']=1;
    }
  }}
function insert_share_footer_link() {  var quick_links=$id('footer_quick_links');
  if ($id('footer_share_link') || !quick_links) {    return;
  }
  var link=$create('DIV');
  link.className='footer__quick-links__link';
  var share_link=$create('A');
  share_link.id='footer_share_link';
  share_link.href='#';
  share_link.onclick=function () {    track_quicklinks('clicked-share-quicklink');
    open_footer_share('open', this);
    return false;
  };
  share_link.appendChild($text('Share'));
  link.appendChild(share_link);
  quick_links.appendChild(link);
}
// JavaScript Document
//DAY WIDTHs
var _day_width=new Array();
//WEEK
_day_width['w60']=2;
_day_width['w70']=3;
_day_width['w80']=5;
_day_width['w90']=7;
_day_width['w100']=9;
_day_width['w110']=11;
_day_width['w120']=14;
//DAY
_day_width['d80']=17;
_day_width['d90']=20;
_day_width['d100']=22;
_day_width['d110']=24;
_day_width['d120']=26;
_day_width['d130']=29;
//_day_width['d130']=33;
/* URL VARIABLES */
const HashSearch=new (function () {  var params;
  this.set=function (key, value) {    params[key]=value;
    this.push();
  };
  this.remove=function (key) {    delete params[key];
    this.push();
  };
  this.setOrRemove=function (key, value, removeOnValue) {    if (value === removeOnValue) {      this.remove(key);
      return;
    }
    this.set(key, value);
  }
  this.get=function (key, value) {    return params[key];
  };
  this.get_all=function () {    var string='';
    for (var i in params) {      if (i != '') {        string += string == '' ? '' : '&';
        string += i + '=' + params[i];
      }
    }
    return string;
  };
  this.keyExists=function (key) {    if (params.hasOwnProperty(key) && HashSearch.get(key) !== undefined) {      return params.hasOwnProperty(key);
    } else {      return false;
    }
  };
  this.push=function () {    var hashBuilder=[],
      key,
      value;
    for (key in params)
      if (params.hasOwnProperty(key)) {        (key=escape(key)), (value=escape(params[key])); // escape(undefined) == "undefined"
        hashBuilder.push(key + (value !== 'undefined' ? '=' + value : ''));
      }
    var new_hash=hashBuilder.join('&').replace(/%2C/g, ',');
    if (window.location.hash !== '#' + new_hash) {      window.history.replaceState(undefined, undefined, '#' + new_hash);
      tgEvents.publish(tgEvents.HASH_CHANGED, {        hash: new_hash,
      });
    }
  };
  (this.load=function () {    params={};
    var hashStr=window.location.hash,
      hashArray,
      keyVal;
    hashStr=hashStr.substring(1, hashStr.length);
    hashArray=hashStr.split('&');
    for (var i=0; i < hashArray.length; i++) {      keyVal=hashArray[i].split('=');
      params[unescape(keyVal[0])] =
        typeof keyVal[1] != 'undefined' ? unescape(keyVal[1]) : keyVal[1];
    }
  })();
})();
function get_is_embedded_view() {  return !!window['_is_embedded_view'] ||
    window.location.href.indexOf('embed.php') > -1 ||
    window.location.href.indexOf('share=') > -1;
}
function navigate_window(url) {  if (get_is_embedded_view()) {    parent_post_message('navigate-url', {url: url});
    return;
  }
  window.location=url;
}
var _default_set_buttons=0;
function url_vars(type) {  var ids=$id('project_ids');
  var user_resources=$id('user_resources_selected');
  var custom_resources=$id('custom_resources_selected');
  var company_resources=$id('company_resources_selected');
  var hide_completed_ele=$id('hide_completed');
  var date_filter=$id('date_filter');
  var color_filter=$id('color_filter');
  if (type == 'get') {    ids.value =
      HashSearch.keyExists('ids') == true ? HashSearch.get('ids') : ids.value;
    user_resources.value =
      HashSearch.keyExists('user') == true
        ? HashSearch.get('user')
        : user_resources.value;
    custom_resources.value =
      HashSearch.keyExists('custom') == true
        ? HashSearch.get('custom')
        : custom_resources.value;
    company_resources.value =
      HashSearch.keyExists('company') == true
        ? HashSearch.get('company')
        : company_resources.value;
    hide_completed_ele.checked =
      HashSearch.keyExists('hide_completed') == true &&
      HashSearch.get('hide_completed') == 'true'
        ? true
        : false;
    if (hide_completed_ele.checked == true) {      $id('hide_completed_check').className += ' checked';
    } else {      $id('hide_completed_check').className=$id(
        'hide_completed_check'
      ).className.replace(/checked/g, '');
    }
    date_filter.value =
      HashSearch.keyExists('date_filter') == true
        ? HashSearch.get('date_filter')
        : date_filter.value;
    color_filter.value =
      HashSearch.keyExists('color_filter') == true
        ? HashSearch.get('color_filter')
        : color_filter.value;
    if (_default_set_buttons == 0) {      //DATE FILTER
      manage_radio(select_header_radio('filter_dates', date_filter.value));
      //COLORS
      var selected_colors=color_filter.value.split(',');
      var color_options=$id('color_filters_dd_box').getElementsByTagName(
        'INPUT'
      );
      //select_color_filter(ele, do_refresh)
      for (var c=0; c < color_options.length; c++) {        if (js_in_array(color_options[c].value, selected_colors) > -1) {          color_options[c].checked=true;
          select_color_filter(color_options[c], 'NO');
        }
      }
      _default_set_buttons=1;
    }
  } else if (type == 'set') {    HashSearch.set('ids', ids.value);
    HashSearch.setOrRemove('user', user_resources.value, '');
    HashSearch.setOrRemove('custom', custom_resources.value, '');
    HashSearch.setOrRemove('company', company_resources.value, '');
    HashSearch.setOrRemove('hide_completed', hide_completed_ele.checked ? 'true' : 'false', 'false');
    HashSearch.setOrRemove('date_filter', date_filter.value, '');
    HashSearch.setOrRemove('color_filter', color_filter.value, '');
  }}
function getUrlVars() {  var vars=[],
    hash;
  var hash_string=window.location.href.slice(
    window.location.href.indexOf('?') + 1
  );
  var hash_vars=hash_string.slice(0, hash_string.indexOf('#'));
  var hashes=hash_vars.split('&');
  var string='';
  for (var i=0; i < hashes.length; i++) {    hash=hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]]=hash[1];
    string += string != '' ? '&' : '';
    string += hash[0] + '=' + hash[1];
  }
  return string;
}
function click_header_tab(ele) {  if ($id('iframe_cover')) {    close_iframe();
  }
  var tab=ele.getAttribute('location');
  var public_keys=get_public_keys() != '' ? get_public_keys().split(',') : [];
  public_keys=public_keys.filter(function (id) {    return id !== 'LOGIN';
  });
  var is_iframe_view=window.location.search.indexOf('iframe_view') > -1;
  if (tab === 'calendar') {    open_calendar();
    tab=null;
  } else if (tab === 'discussions') {    open_discussions();
    tab=null;
  } else if (tab === 'more') {    click_header_tab_view_more();
    tab=null;
  } else if (tab === 'people') {    open_people_tab();
    tab=null;
  } else if (tab === 'board') {    open_new_app_route('board');
    return;
  } else if (tab === 'list' && public_keys.length === 0 && !is_iframe_view) {    open_new_list_view();
    return;
  } else if (tab === 'raci') {    open_new_app_route('raci');
    return;
  }
  if (tab && ele.className != 'selected') {    //GET NEW URL
    const url=get_header_tab_url(tab);
    //TAKE ME THERE
    navigate_window(url);
  } else if (tab) {    select_header_tab(ele);
  }}
function get_header_tab_url(tab) {    var cur_url=window.location.toString();
    var opts=[
      'gantt/summary',
      'gantt/schedule',
      'gantt/list',
      'gantt/history',
      'gantt/documents',
      'gantt/people',
    ];
    for (var i=0; i < opts.length; i++) {      cur_url=cur_url.replace(opts[i], 'XXXX');
    }
    var url=cur_url.replace('XXXX', 'gantt/' + tab);
    return url
      .replace(/onload/g, 'original_onload')
      .replace(/embed.php/g, '');
}
function click_header_tab_view_more() {  var ele=$id('header_more_dropdown');
  ele.className=ele.className === 'hidden' ? '' : 'hidden';
  if (ele.className === '') {    var sidebar_size=sidebar_width();
    sidebar_size=sidebar_size === 0 ? 50 : sidebar_size;
    ele.style.marginLeft=sidebar_size + 'px';
    document.body.appendChild(ele);
    var bg=build_background_cover();
    bg.style.background='none';
    bg.onclick=function () {      $id('header_more_dropdown').className='hidden';
      hide_backdrop();
    };
  }}
function hide_show_columns() {  if (_version == 'gantt_chart') {    var html_string='';
    var target_style=$id('column_styles');
    //SEE IF ESTIMATED HOURS IS BEING USED
    var estimated_hours_on=false;
    for (var p in _projects) {      estimated_hours_on =
        _projects[p]['project_enable_hours'] == 1 ? true : estimated_hours_on;
    }
    var showing=[];
    //ESTIMATED HOURS
    if (
      $id('show_estimated_hours_column').checked == false ||
      estimated_hours_on == false
    ) {      html_string += '#category_task_list .estimated_hours { display:none; }\n';
      html_string +=
        '#spacer_tab_estimated_hours { display:none !important; }\n';
      html_string +=
        '.task_resources_dd .resource_search_results .resource_name { width:100%; }\n';
      html_string += '.task_in_chart.actual_hours_bar { display:none; }\n';
    } else {      showing.push('estimated_hours');
    }
    //ACTUAL HOURS
    if ($id('show_actual_hours_column').checked == false) {      html_string += '#category_task_list .actual_hours { display:none; }\n';
      html_string += '#spacer_tab_actual_hours { display:none !important; }\n';
      html_string += '.task_in_chart.actual_hours_bar { display:none; }\n';
    } else {      showing.push('actual_hours');
      display_actual_hours_bar();
      update_group_bar();
    }
    //ASSIGNED RESOURCES
    if ($id('show_assigned_resources_column').checked == false) {      html_string +=
        '#category_task_list .assigned_resources { display:none; }\n';
      html_string +=
        '#spacer_tab_assigned_resources { display:none !important; }\n';
    } else {      showing.push('assigned_resources');
    }
    //PERCENT COMPLETE
    if ($id('show_percent_complete_column').checked == false) {      html_string +=
        '#category_task_list .percent_complete { display:none; }\n';
      html_string +=
        '#spacer_tab_percent_complete { display:none !important; }\n';
    } else {      showing.push('percent_complete');
    }
    //ADDITIONAL CSS CLEANUP
    if (showing.length == 1 && showing[0] == 'estimated_hours') {      if (estimated_hours_on == false) {        showing=[];
      }
    }
    //UPDATE STYLING
    if (target_style) {      target_style.innerHTML=html_string;
    }
    $id('show_hours_next_to_resource_name_preference').style.display =
      estimated_hours_on == false ? 'none' : 'block';
    //ESTIMATED HOURS CONTROL
    var checkbox=$id('show_estimated_hours_column');
    var control=$id('show_estimated_hours_column_control');
    if (estimated_hours_on == false && checkbox.checked == true) {      checkbox.checked=false;
      control.className=control.className.replace(/checked/g, '');
    }
    //ADJUST ADDITIONAL THINGS
    adjust_left_panel_width(_left_width * 1);
  }}
function set_column_bars() {  //SETUP COLUMN BAR
  var current_bars=$id('category_task_list').getElementsByTagName('DIV');
  for (var c=current_bars.length - 1; c >= 0; c--) {    if (current_bars[c].className.indexOf('dividing_bar') > -1) {      current_bars[c].parentNode.removeChild(current_bars[c]);
    }
  }
  var bars=$id('spacer').getElementsByTagName('DIV');
  var left=0;
  var left_sub=$id('meta_data') ? $id('meta_data').offsetWidth : 0;
  for (var i=0; i < bars.length; i++) {    if (
      bars[i].className.indexOf('spacer_tab') > -1 &&
      bars[i].offsetWidth > 0
    ) {      var left=bars[i].offsetLeft - left_sub + 11;
      var bar=$create('DIV');
      bar.className='dividing_bar';
      bar.style.marginLeft=left + 'px';
      $id('category_task_list').appendChild(bar);
    }
  }
  if ((resize_bar=$id('resize_bar'))) {    if (left > 0) {      resize_bar.style.left=left + left_sub + 'px';
      var diff=$id('inner_list_wrapper').offsetWidth - left;
      resize_bar.setAttribute('diff', diff);
    } else {      resize_bar.style.left =
        $id('category_task_list').offsetWidth * 1 + 6 + left_sub + 'px';
      resize_bar.setAttribute('diff', 0);
    }
  }}
function any_filters() {  var applied=false;
  applied=$id('user_resources_selected').value != '' ? true : applied;
  applied=$id('custom_resources_selected').value != '' ? true : applied;
  applied=$id('company_resources_selected').value != '' ? true : applied;
  applied=$id('hide_completed').checked == true ? true : applied;
  applied=$id('date_filter').value != '' ? true : applied;
  return applied;
}
function any_filters_with_color() {  var has_filters=any_filters();
  var color_applied=$id('color_filter').value != '';
  return has_filters || color_applied;
}
function select_header_radio(radio_name, value) {  value=value || '';
  //DATE FILTER
  var selected_ele=null;
  var options1=$id('underbar').getElementsByTagName('DIV');
  for (var i=0; i < options1.length; i++) {    if (
      options1[i].className.indexOf('radio') > -1 &&
      options1[i].getAttribute('name') == radio_name &&
      options1[i].getAttribute('value') == value
    ) {      selected_ele=options1[i];
    }
  }
  //OTHER DROPDOWNS
  if (selected_ele == null && radio_name == 'filter_dates') {    var options2=$id('date_filters_dd_box').getElementsByTagName('DIV');
    for (var i=0; i < options2.length; i++) {      if (
        options2[i].className.indexOf('option2') > -1 &&
        options2[i].getAttribute('value') == value
      ) {        selected_ele=$id('filter_dates_other');
        select_date_filter(options2[i], 'no');
      }
    }
  }
  return selected_ele;
}
/* END URL VARIABLES */
function check_key(e) {  e=e || event;
  if (e.keyCode == '27' && _is_building == 1) {    // escape key on critical path builds
    close_cp_create();
    load_critical_paths();
  } else if (e.keyCode == 27 && _task_reschedule == true) {    kill_move();
  } else if (e.keyCode == 13) {    // enter key
  }}
function return_keycode(e) {  e=e || window.event;
  return e.keyCode;
}
function input_keycode(e, ele) {  e=e || window.event;
  var key=e.keyCode;
  if (key == _master_keys['enter'] && ele.onchange) {    //WILL BLUR THE ELEMENT AND RUN IT's ONCHANGE FUNCTION
    ele.setAttribute('enter', true); // if the onchange is effected by if the enter key was pressed
    ele.onchange();
    ele.blur();
    ele.setAttribute('enter', false); // reset the enter key value
  } else if (key == _master_keys['enter']) {    //WILL JUST BLUR THE ELEMENT
    ele.blur();
    document.body.focus();
  } else if (key == _master_keys['escape']) {    // WILL CANCEL ANY CHANGES TO THE ELEMENT AND BLUR IT
    ele.setAttribute('is_cancel', 1);
    ele.blur();
    document.body.focus();
  } else if (
    key == _master_keys['up'] &&
    ele.getAttribute('allow_arrows') == 1
  ) {    // ADD 5 TO THE PERCENT COMPLETE VALUE
    var v=ele.value * 1 + 5;
    v=v > 100 ? 100 : v;
    ele.value=v != 'NaN' ? v : ele.value;
  } else if (
    key == _master_keys['down'] &&
    ele.getAttribute('allow_arrows') == 1
  ) {    // SUBTRACT 5 FROM THE PERCENT COMPLETE NUMBER
    var v=ele.value * 1 - 5;
    v=v < 0 ? 0 : v;
    ele.value=v != 'NaN' ? v : ele.value;
  } else if (key == _master_keys['tab']) {    //SINCE THE TAB ORDER IS OUT OF WACK, THIS WILL CORRECT IT
    if (
      ele.id.indexOf('task_name') > -1 ||
      ele.id.indexOf('task_estimated_hours') > -1 ||
      ele.id.indexOf('task_percent_input') > -1
    ) {      click_selected_field(select_field(ele.getAttribute('task_id'), ele));
    }
  }}
function select_field(task_id, ele) {  allow_hover=true;
  var fields=['task_name'];
  if (
    $id('show_estimated_hours_column').checked &&
    $id('spacer_tab_estimated_hours').offsetWidth > 0
  ) {    fields.push('task_estimated_hours');
  }
  if (
    $id('show_actual_hours_column').checked &&
    $id('spacer_tab_actual_hours').offsetWidth > 0
  ) {    fields.push('task_actual_hours');
  }
  if (
    $id('show_assigned_resources_column').checked &&
    $id('spacer_tab_assigned_resources').offsetWidth > 0
  ) {    fields.push('task_assigned_resources');
  }
  if (
    $id('show_percent_complete_column').checked &&
    $id('spacer_tab_percent_complete').offsetWidth > 0
  ) {    fields.push('task_percent_input');
  }
  //FIND NEXT
  var next='';
  if (ele.id.indexOf('task_name') > -1) {    //COMING FROM NAME
    var next=fields.indexOf('task_name') * 1 + 1;
  } else if (ele.id.indexOf('task_estimated_hours') > -1) {    //COMING FROM ESTIMATED HOURS
    var next=fields.indexOf('task_estimated_hours') * 1 + 1;
  } else if (ele.id.indexOf('task_assigned_resources') > -1) {    var next=fields.indexOf('task_assigned_resources') * 1 + 1;
    var ele2=$id('people_assigned_column_edit_resources');
    if (ele2) {      ele2.parentNode.removeChild(ele2);
    }
  } else if (ele.id.indexOf('task_percent_input') > -1) {    var next=fields.indexOf('task_percent_input') * 1 + 1;
  }
  //SELECT THE INPUT
  if (fields[next]) {    return $id(fields[next] + '_' + task_id);
  } else {    //WRAP TO NEXT TASK ROW
    var cur_task=$id('task_name_' + task_id);
    var all_tasks=$id('category_task_list').getElementsByTagName('DIV');
    var use_next=false;
    var atl=all_tasks.length;
    for (var i=0; i < atl; i++) {      if (all_tasks[i].id.indexOf('task_title_') > -1) {        if (all_tasks[i].id == 'task_title_' + task_id) {          use_next=true;
        } else if (use_next) {          var new_id=all_tasks[i].getAttribute('task_id');
          i=all_tasks.length * 2;
          return $id('task_name_' + new_id);
        }
      }
    }
  }}
function click_selected_field(ele) {  if (ele) {    if (ele.id.indexOf('task_name_') > -1) {      inline_edit_task(ele, true);
    } else {      setTimeout(function () {        ele.click();
      }, 100);
    }
  }}
function cleanup_editable_div(div) {  html=trim(div.textContent);
  html=make_numeric(html) * 1;
  remove_child_nodes(div);
  div.appendChild($text(html));
}
function cleanup_editable_div_text(div) {  html=div.textContent;
  html=html.replace(/\r/g, '');
  html=html.replace(/\n/g, '');
  remove_child_nodes(div);
  div.appendChild($text(html));
}
function js_in_array(needle, haystack) {  var key=-1;
  var hlen=haystack.length;
  for (i=0; i < hlen; i++) {    if (haystack[i] == needle) {      key=i;
    }
  }
  return key;
}
function sortMultiDimensional(a, b) {  // this sorts the array using the second element
  return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0;
}
function update_task_percent_complete(ele) {  var value=ele.getAttribute('percent_complete');
  if (value == '' || value < 0) {    value=0;
    ele.firstChild.nodeValue=0;
  } else if (value > 100) {    value=100;
    ele.firstChild.nodeValue=100;
  }
  var task_id=ele.getAttribute('task_id');
  //var prog_bar=$id("task_div_"+ele.getAttribute("task_id")).firstChild;
  var prog_bars=$id(
    'task_div_' + ele.getAttribute('task_id')
  ).getElementsByTagName('DIV');
  for (var p in prog_bars) {    if (
      typeof prog_bars[p] == 'object' &&
      prog_bars[p].className.indexOf('progress_bar') > -1
    ) {      var prog_bar=prog_bars[p];
      if (value == '') {        prog_bar.className='progress_bar hidden';
        prog_bar.style.width=0;
      } else {        if (value == 0) {          prog_bar.className='progress_bar hidden';
          prog_bar.style.width=0;
        } else {          if (prog_bar) {            prog_bar.className='progress_bar radius';
            prog_bar.style.width=value + '%';
          }
        }
      }
    }
  }}
function is_visible(type, type_id, from_source, direction) {  if (type == 'task') {    if (_tasks[_tasks_key[type_id]]['show_task'] == false) {      return false;
    } else {      var group_id=_tasks[_tasks_key[type_id]]['group_id'];
      return is_visible('group', group_id, from_source, direction);
    }
  } else if (type == 'group') {    var group=_groups[_groups_key[type_id]];
    var parent=group['parent_group_id'];
    var visible=group['group_hidden'] == 1 ? false : true; //convert to opposite
    if (group['visible'] == false) {      return false;
    } else {      if (visible == false && from_source == 'task') {        return false;
      } else if (
        parent == '' &&
        visible == false &&
        (from_source == 'task' || from_source == 'group')
      ) {        return true;
      } else if (parent == '') {        return from_source == 'group' ? true : visible;
      } else {        return is_visible('group', parent, 'group_parent', direction);
      }
    }
  }}
function is_group_visible(group_id, temp) {  if (group_id != 'undefined') {    var group=_groups[_groups_key[group_id]];
    if (group) {      if (group['group_hidden'] > 0) {        return false;
      } else if (group['parent_group_id'] != '') {        return is_group_visible(group['parent_group_id'], temp++);
      } else {        return true;
      }
    } else {      return null;
    }
  } else {    return null;
  }}
function group_in_group(child, parent) {  var child_parent=_groups[_groups_key[child]]['parent_group_id'];
  if (child_parent == parent || child == parent) {    return true;
  } else if (child_parent == '') {    return false;
  } else {    return group_in_group(child_parent, parent);
  }}
function make_task_visible(task_id) {  if (_tasks_key[task_id]) {    var group_id=_tasks[_tasks_key[task_id]]['group_id'];
    hide_group(group_id, 0);
    var group=_groups[_groups_key[group_id]];
    while (group['parent_group_id'] != '') {      var parent=_groups[_groups_key[group['parent_group_id']]];
      hide_group(parent['group_id'], 0);
      group=_groups[_groups_key[group['parent_group_id']]];
    }
  }}
function tasks_by_group(group_id) {  var ret='';
  var tl=_tasks.length;
  for (var i=0; i < tl; i++) {    if (_tasks[i]['group_id'] == group_id) {      ret += ret == '' ? _tasks[i]['task_id'] : ',' + _tasks[i]['task_id'];
    }
  }
  return ret;
}
function get_group_tasks(group_id) {  var tasks=tasks_by_group(group_id);
  //loop through groups to find subs
  var gl=_groups.length;
  for (var g=0; g < gl; g++) {    if (
      _groups[g]['parent_group_id'] != '' &&
      _groups[g]['parent_group_id'] == group_id
    ) {      var add=get_group_tasks(_groups[g]['group_id']);
      if (add != '') {        tasks += tasks == '' ? add : ',' + add;
      }
    }
  }
  return tasks;
}
function update_group_bar() {  var pl=_projects.length;
  for (var p=0; p < pl; p++) {    _projects[p]['project_start']='';
    _projects[p]['project_end']='';
    _projects[p]['total_days']=0;
    _projects[p]['completed_days']=0;
    _projects[p]['estimated_hours']=0;
    _projects[p]['actual_hours']=0;
  }
  //CLEAR GROUP START DATES
  var gl=_groups.length;
  for (var g=0; g < gl; g++) {    _groups[g]['min_date']='';
    _groups[g]['max_date']='';
    _groups[g]['total_days']=0;
    _groups[g]['completed_days']=0;
    _groups[g]['estimated_hours']=0;
    _groups[g]['actual_hours']=0;
  }
  //FIND MIN AND MAX DATES
  var tl=_tasks.length;
  for (var t=0; t < tl; t++) {    if (_tasks[t]['task_id'].indexOf('new-task') > -1) {      continue;
    }
    var project_id=_tasks[t]['project_id'];
    var group_id=_tasks[t]['group_id'];
    var g_key=_groups_key[group_id];
    var p_key=_projects_key[project_id];
    //ESTIMATED HOURS
    var est_hours=isNaN(_tasks[t]['estimated_hours'])
      ? 0
      : _tasks[t]['estimated_hours'] * 1;
    update_parent_group_estimated_hours(group_id, est_hours);
    _projects[p_key]['estimated_hours'] += est_hours;
    //ACTUAL HOURS
    var act_hours=isNaN(_tasks[t]['actual_hours'])
      ? 0
      : _tasks[t]['actual_hours'] * 1;
    update_parent_group_actual_hours(group_id, act_hours);
    _projects[p_key]['actual_hours'] += act_hours;
    //COMPLETED DAYS/PERCENT
    var total_days=_tasks[t]['total_days'];
    var percent=_tasks[t]['percent_complete'];
    _tasks[t]['completed_days']=(total_days * percent) / 100;
    //DAYS
    _groups[g_key]['total_days'] += _tasks[t]['total_days'] * 1;
    _groups[g_key]['completed_days'] += _tasks[t]['completed_days'] * 1;
    _projects[p_key]['total_days'] += _tasks[t]['total_days'] * 1;
    _projects[p_key]['completed_days'] += _tasks[t]['completed_days'] * 1;
    if (_groups[g_key]['parent_group_id'] != '') {      update_parent_group_day_count(
        _groups[g_key]['parent_group_id'],
        _tasks[t]['total_days'],
        _tasks[t]['completed_days']
      );
    }
    //START DATE
    if (
      _tasks[t]['start_date'] != '' &&
      (_tasks[t]['start_date'] < _groups[g_key]['min_date'] ||
        _groups[g_key]['min_date'] == '')
    ) {      _groups[g_key]['min_date']=_tasks[t]['start_date'];
      //PROJECT
      if (
        _tasks[t]['start_date'] <
          _projects[_projects_key[_tasks[t]['project_id']]]['project_start'] ||
        _projects[p_key]['project_start'] == ''
      ) {        _projects[p_key]['project_start']=_tasks[t]['start_date'];
      }
      if (_groups[g_key]['parent_group_id'] != '') {        update_parent_group_date(
          'min',
          _groups[g_key]['parent_group_id'],
          _tasks[t]['start_date']
        );
      }
    }
    //END DATE
    if (
      _tasks[t]['end_date'] != '' &&
      (_tasks[t]['end_date'] > _groups[g_key]['max_date'] ||
        _groups[g_key]['max_date'] == '')
    ) {      _groups[_groups_key[group_id]]['max_date']=_tasks[t]['end_date'];
      //PROJECT
      if (
        _tasks[t]['end_date'] > _projects[p_key]['project_end'] ||
        _projects[p_key]['project_end'] == ''
      ) {        _projects[p_key]['project_end']=_tasks[t]['end_date'];
      }
      if (_groups[g_key]['parent_group_id'] != '') {        update_parent_group_date(
          'max',
          _groups[g_key]['parent_group_id'],
          _tasks[t]['end_date']
        );
      }
    }
  }
  //UPDATE BARS
  if (_version == 'gantt_chart') {    var gl=_groups.length;
    for (var g=0; g < gl; g++) {      var g_id=_groups[g]['group_id'];
      if ($id('category_div_' + g_id)) {        update_group_percentage(g_id);
        update_position(
          $id('category_div_' + g_id),
          'group',
          _groups[g]['min_date'],
          _groups[g]['max_date']
        );
        update_group_estimated_hours(g_id);
        update_group_actual_hours(g_id);
      }
    }
    var pl=_projects.length;
    for (var p=0; p < pl; p++) {      if ($id('project_div_' + _projects[p]['project_id'])) {        update_position(
          $id('project_div_' + _projects[p]['project_id']),
          'project',
          _projects[p]['project_start'],
          _projects[p]['project_end']
        );
      }
      //ESTIMATED HOURS
      if (
        _projects[p]['project_enable_hours'] == 1 &&
        $id('project_estimated_hours_' + _projects[p]['project_id'])
      ) {        _projects[p]['estimated_hours'] =
          Math.round(_projects[p]['estimated_hours'] * 100) / 100;
        $id(
          'project_estimated_hours_' + _projects[p]['project_id']
        ).firstChild.nodeValue =
          _projects[p]['estimated_hours'] == 0
            ? '0 hrs'
            : _projects[p]['estimated_hours'] + ' hrs';
      }
      //ACTUAL HOURS
      var project_id=_projects[p]['project_id'];
      if (
        _projects[p]['time_tracking'] == 1 &&
        $id('actual_hours_' + _projects[p]['project_id'])
      ) {        _projects[p]['actual_hours'] =
          Math.round(_projects[p]['actual_hours'] * 100) / 100;
        remove_child_nodes($id('actual_hours_' + _projects[p]['project_id']));
        $id('actual_hours_' + _projects[p]['project_id']).appendChild(
          $text(_projects[p]['actual_hours'] + ' hrs')
        );
        //ACTUAL HOURS BAR
        if ($id('show_actual_hours_column').checked == true) {          var project_bar=$id('project_div_' + project_id);
          var left=project_bar.getAttribute('var_left');
          var width=project_bar.getAttribute('var_width') - 1;
          var actual_hours_bar =
            $id('project_div_hours_' + project_id) || $create('DIV');
          actual_hours_bar.id='project_div_hours_' + project_id;
          actual_hours_bar.className='task_in_chart actual_hours_bar';
          actual_hours_bar.style.marginLeft=left + 'px';
          var percent =
            _projects[p]['estimated_hours'] == 0
              ? 0
              : Math.round(
                  (_projects[p]['actual_hours'] /
                    _projects[p]['estimated_hours']) *
                    100,
                  2
                ) * 0.01;
          var bar_width=width * percent;
          if (
            bar_width > width ||
            _projects[p]['actual_hours'] > _projects[p]['estimated_hours']
          ) {            bar_width=width;
            actual_hours_bar.className += ' red';
          } else if (bar_width <= 0) {            bar_width=0;
            actual_hours_bar.className='hidden';
          } else {            actual_hours_bar.className += ' green';
          }
          actual_hours_bar.style.width=bar_width + 'px';
          project_bar.parentNode.appendChild(actual_hours_bar);
          add_multi_select(actual_hours_bar, 'project', project_id);
        }
      }
      //PERCENT COMPLETE
      if (_projects[p]['total_days'] > 0) {        var percent_complete =
          (_projects[p]['completed_days'] / _projects[p]['total_days']) * 100;
        percent_complete =
          percent_complete > 99 && percent_complete < 100
            ? 99
            : percent_complete;
      } else {        var percent_complete=0;
      }
      if ($id('project_percent_complete_' + _projects[p]['project_id'])) {        $id(
          'project_percent_complete_' + _projects[p]['project_id']
        ).firstChild.nodeValue=Math.round(percent_complete) + '%';
      }
      _projects[p]['percent_complete']=percent_complete;
    }
    //REFRESH RESOURCE VIEW
    display_resource_view('nosave');
  } else if (_version == 'list_view') {    var gl=_groups.length;
    for (var g=0; g < gl; g++) {      update_group_percentage(_groups[g]['group_id']);
    }
    var pl=_projects.length;
    for (var p=0; p < pl; p++) {      if (_projects[p]['total_days'] > 0) {        var percent_complete =
          (_projects[p]['completed_days'] / _projects[p]['total_days']) * 100;
        percent_complete =
          percent_complete > 99 && percent_complete < 100
            ? 99
            : percent_complete;
      } else {        var percent_complete=0;
      }
      _projects[p]['percent_complete']=percent_complete;
    }
  }}
function update_parent_group_date(which, parent_group_id, date) {  if (which == 'min') {    if (
      date != '' &&
      (date < _groups[_groups_key[parent_group_id]]['min_date'] ||
        _groups[_groups_key[parent_group_id]]['min_date'] == '')
    ) {      _groups[_groups_key[parent_group_id]]['min_date']=date;
      if (_groups[_groups_key[parent_group_id]]['parent_group_id'] != '') {        update_parent_group_date(
          which,
          _groups[_groups_key[parent_group_id]]['parent_group_id'],
          date
        );
      }
    }
  } else if (which == 'max') {    if (
      date != '' &&
      (date > _groups[_groups_key[parent_group_id]]['max_date'] ||
        _groups[_groups_key[parent_group_id]]['max_date'] == '')
    ) {      _groups[_groups_key[parent_group_id]]['max_date']=date;
      if (_groups[_groups_key[parent_group_id]]['parent_group_id'] != '') {        update_parent_group_date(
          which,
          _groups[_groups_key[parent_group_id]]['parent_group_id'],
          date
        );
      }
    }
  }}
function update_parent_group_day_count(group_id, total_days, completed_days) {  _groups[_groups_key[group_id]]['total_days'] += total_days * 1;
  _groups[_groups_key[group_id]]['completed_days'] += completed_days * 1;
  if (_groups[_groups_key[group_id]]['parent_group_id'] != '') {    update_parent_group_day_count(
      _groups[_groups_key[group_id]]['parent_group_id'],
      total_days,
      completed_days
    );
  }}
function update_parent_group_estimated_hours(group_id, total_hours) {  var group_key=_groups_key[group_id];
  _groups[group_key]['estimated_hours'] += total_hours;
  if (_groups[group_key]['parent_group_id'] != '') {    var parent_group_id=_groups[group_key]['parent_group_id'];
    update_parent_group_estimated_hours(parent_group_id, total_hours);
  }}
function update_group_estimated_hours(group_id) {  var group_key=_groups_key[group_id];
  var div=$id('group_estimated_hours_' + group_id);
  if (
    div &&
    _projects[_projects_key[_groups[group_key]['project_id']]][
      'project_enable_hours'
    ] == 1
  ) {    _groups[group_key]['estimated_hours'] =
      Math.round(_groups[group_key]['estimated_hours'] * 100) / 100;
    div.firstChild.nodeValue =
      _groups[group_key]['estimated_hours'] == 0
        ? '0 hrs'
        : _groups[group_key]['estimated_hours'] + ' hrs';
  }}
function update_parent_group_actual_hours(group_id, total_hours) {  var group_key=_groups_key[group_id];
  _groups[group_key]['actual_hours'] += total_hours;
  if (_groups[group_key]['parent_group_id'] != '') {    var parent_group_id=_groups[group_key]['parent_group_id'];
    update_parent_group_actual_hours(parent_group_id, total_hours);
  }}
function update_group_actual_hours(group_id) {  var group_key=_groups_key[group_id];
  if (
    _projects[_projects_key[_groups[group_key]['project_id']]][
      'time_tracking'
    ] == 1
  ) {    var div=$id('group_actual_hours_' + group_id);
    if (div) {      _groups[group_key]['actual_hours'] =
        Math.round(_groups[group_key]['actual_hours'] * 100) / 100;
      div.firstChild.nodeValue =
        _groups[group_key]['actual_hours'] == 0
          ? '0 hrs'
          : _groups[group_key]['actual_hours'] + ' hrs';
    }
    //ACTUAL HOURS BAR
    if ($id('show_actual_hours_column').checked == true) {      var group_bar=$id('category_div_' + group_id);
      var left=group_bar.getAttribute('var_left');
      var width=group_bar.getAttribute('var_width') - 2;
      var actual_hours_bar =
        $id('group_div_hours_' + group_id) || $create('DIV');
      actual_hours_bar.id='group_div_hours_' + group_id;
      actual_hours_bar.className='task_in_chart actual_hours_bar';
      actual_hours_bar.style.marginLeft=left + 'px';
      var percent =
        _groups[group_key]['estimated_hours'] == 0
          ? 0
          : Math.round(
              (_groups[group_key]['actual_hours'] /
                _groups[group_key]['estimated_hours']) *
                100,
              2
            ) * 0.01;
      var bar_width=width * percent;
      if (
        bar_width > width ||
        _groups[group_key]['actual_hours'] >
          _groups[group_key]['estimated_hours']
      ) {        bar_width=width;
        actual_hours_bar.className += ' red';
      } else if (bar_width <= 0) {        bar_width=0;
        actual_hours_bar.className='hidden';
      } else {        actual_hours_bar.className += ' green';
      }
      actual_hours_bar.style.width=bar_width + 'px';
      group_bar.parentNode.appendChild(actual_hours_bar);
      add_multi_select(actual_hours_bar, 'group', group_id);
    }
  }}
function update_group_percentage(group_id) {  var total_days=_groups[_groups_key[group_id]]['total_days'];
  var completed_days=_groups[_groups_key[group_id]]['completed_days'];
  var percent_complete=(completed_days / total_days) * 100;
  percent_complete =
    percent_complete > 99 && percent_complete < 100 ? 99 : percent_complete;
  var p_complete =
    percent_complete <= 0 || isNaN(percent_complete) == true
      ? 0
      : percent_complete;
  if (_version == 'gantt_chart') {    var div=$id('category_div_' + group_id);
    var progress_bar_element=div.firstChild.firstChild;
    if (progress_bar_element) {      if (p_complete == 0) {        progress_bar_element.className='hidden';
        progress_bar_element.style.width=0;
      } else {        progress_bar_element.className='progress_bar_category';
        progress_bar_element.style.width=Math.round(percent_complete) + '%';
      }
      //SET ARROWS
      var arrow_width=7;
      var percent_width=div.firstChild.offsetWidth * 1;
      var full_width=div.offsetWidth * 1;
      var difference=full_width - percent_width;
    }
    var column=$id('group_percent_complete_' + group_id);
    remove_child_nodes(column);
    column.appendChild($text(Math.round(p_complete) + '%'));
  } else if (_version == 'list_view') {    var target=$id('category_percent_complete_' + group_id);
    if (target) {      target.firstChild.nodeValue=Math.round(p_complete) + '%';
    }
  }}
function update_position(element, type, start_date, end_date) {  var day_width=_day_width[$id('zoom').value];
  start_date=start_date == null ? '' : start_date;
  end_date=end_date == null ? '' : end_date;
  var pos=find_position(start_date, end_date, day_width);
  if (type == 'task') {    var task_id=element.parentNode.getAttribute('task_id');
    if (pos[1] < day_width) {      pos[1]=day_width;
    } else {      pos[1]=pos[1] + 2; // take the space that the task bar border used to take
    }
    _tasks[_tasks_key[task_id]]['start_date']=start_date;
    _tasks[_tasks_key[task_id]]['end_date']=end_date;
    element.setAttribute('mousedown', 0);
    element.style.borderWidth='1px';
    if (start_date != '' && end_date != '') {      element.parentNode.removeAttribute('nodate');
    }
    element.parentNode.onmousemove=null;
    element.className += ' move_animate';
    var e_child=element.childNodes;
    for (var e=0; e < e_child.length; e++) {      if (e_child[e].className.indexOf('task_name_bar') !== -1) {        continue;
      }
      if (
        e_child[e].className.indexOf('progress_bar') === -1 &&
        e_child[e].className.indexOf('milestone') === -1
      ) {        e_child[e].parentNode.removeChild(e_child[e]);
      }
    }
    if (element.className.indexOf('milestone') > -1) {      pos[1]++;
    }
    if (element.nextSibling) {      if (element.nextSibling.getAttribute('is_badge') == 1) {        var badge=element.nextSibling;
        badge.style.marginLeft=pos[0] * 1 + pos[1] + 2 + 'px';
        var badges=badge.getElementsByTagName('DIV');
        for (i=0; i < badges.length; i++) {          if (badges[i].getAttribute('front_minus') != undefined) {            badges[i].style.marginLeft =
              '-' +
              (pos[1] * 1 + badges[i].getAttribute('front_minus') * 1) +
              'px';
          }
        }
      }
    }
    element.style.borderWidth='1px';
  } else if (type == 'group') {    element.className += ' move_animate';
    var group_id=element.parentNode.getAttribute('group_id');
    pos[1] += 2;
    //SET THE BADGES
    if (element.nextSibling) {      if (element.nextSibling.getAttribute('is_badge') == 1) {        var badge=element.nextSibling;
        badge.style.marginLeft=pos[0] * 1 + pos[1] + 2 + 'px';
      }
    }
  } else if (type == 'project') {    element.className += ' move_animate';
    var project_id=element.parentNode.getAttribute('project_id');
    if ($id('project_name_next_to_bar_' + project_id)) {      var left=pos[0] * 1 + pos[1] + 2;
      if (left > 2) {        $id('project_name_next_to_bar_' + project_id).className =
          'project_name_bar';
        $id('project_name_next_to_bar_' + project_id).style.marginLeft =
          pos[0] * 1 + pos[1] + 2 + 'px';
      } else {        $id('project_name_next_to_bar_' + project_id).className='hidden';
      }
    }
  }
  pos[0]=pos[0] == 0 ? -100 : pos[0];
  if (element && pos[0] != null && pos[1] != null) {    element.style.marginLeft=pos[0] + 'px';
    element.style.left='0';
    element.setAttribute('var_left', pos[0]);
    element.setAttribute('def_left', pos[0]);
    element.style.width=pos[1] + 'px';
    element.setAttribute('var_width', pos[1]);
    element.setAttribute('def_width', pos[1]);
    if (type == 'task') {      _tasks[_tasks_key[task_id]]['var_left']=pos[0];
      _tasks[_tasks_key[task_id]]['def_left']=pos[0];
      _tasks[_tasks_key[task_id]]['var_width']=pos[1];
      _tasks[_tasks_key[task_id]]['def_width']=pos[1];
    }
  }
  if (type == 'task' || type == 'group' || type == 'project') {    setTimeout(function () {      element.className=trim(element.className.replace(' move_animate', ''));
    }, 750);
  }}
function find_day_width() {  return _day_width[$id('zoom').value];
}
function find_date(ele, day_width) {  if (typeof ele == 'object') {    var start_left=ele.offsetLeft;
    var end_right=start_left * 1 + ele.offsetWidth;
    var ret1=return_date(start_left, 'start', day_width);
    var ret2=return_date(end_right, 'end', day_width);
    if ((ret1 == null || ret2 == null) && ele.getAttribute('task_id') != null) {      var task_id=ele.getAttribute('task_id');
      var task=_tasks[_tasks_key[task_id]];
      var left=task['var_left'] * 1;
      ret1=return_date(left, 'start', day_width);
      var right=task['var_left'] * 1 + task['var_width'];
      ret2=return_date(right, 'end', day_width);
    }
    return [ret1, ret2];
  } else {    return return_date(ele, 'start', day_width);
  }}
function return_date(pixel_offset, side, day_width) {  if (side == 'end') {    pixel_offset=pixel_offset - day_width - 1;
  }
  var divs=$id('background_lines').getElementsByTagName('DIV');
  var tmin=null;
  var tmax=null;
  var first=null;
  var i_set=0;
  i_set=Math.floor(((pixel_offset * 1) / day_width) * 1 * 2) - 20;
  i_set=i_set < 0 ? 0 : i_set;
  var dl=divs.length;
  for (var i=i_set; i < dl; i++) {    if (
      divs[i].getAttribute('var_left') != undefined &&
      divs[i].getAttribute('date') != undefined
    ) {      first=divs[i];
      if (divs[i].getAttribute('var_left') <= pixel_offset) {        tmin=divs[i];
      }
      if (divs[i].getAttribute('var_left') >= pixel_offset && tmax == null) {        tmax=divs[i];
        i=divs.length * 2;
        break;
      }
    }
  }
  var dt=null;
  if (tmin != null && tmax != null) {    if (tmin == null) {      tmin=first;
      dt=first;
      setTimeout(load_gantt, 1500);
    } else {      var diff1=pixel_offset - tmin.getAttribute('var_left');
      var diff2=tmax.getAttribute('var_left') - pixel_offset;
      dt=diff1 < diff2 ? tmin : tmax;
    }
    return dt.getAttribute('date');
  } else {    return null;
  }}
function pull_resource(type, id) {  for (var i=0; i < _all_resources.length; i++) {    var resource_info=_all_resources[i];
    var LINK_TYPE=getNodeValue(resource_info, 'LINK_TYPE');
    var RESOURCE_ID=getNodeValue(resource_info, 'RESOURCE_ID');
    var RESOURCE_NAME=getNodeValue(resource_info, 'RESOURCE_NAME');
    if (LINK_TYPE == type && RESOURCE_ID == id) {      return RESOURCE_NAME;
    }
  }}
function today_date() {  var now=new Date();
  var cur_year=now.getFullYear();
  var cur_month=now.getMonth() * 1 + 1;
  cur_month=cur_month < 10 ? '0' + cur_month : cur_month;
  var cur_day=now.getDate();
  cur_day=cur_day < 10 ? '0' + cur_day : cur_day;
  var cur_date=cur_year + '-' + cur_month + '-' + cur_day;
  return cur_date;
}
function clean_date(string) {  if (string && string.split('-').length == 3) {    /*
var dt=new Date(string.split("-")[0], string.split("-")[1]-1, string.split("-")[2]);
var months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var dys=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
var str=dys[dt.getDay()]+", "+months[dt.getMonth()] + " " + dt.getDate() + ", "+ dt.getFullYear();
return str;
*/
    var dt=new Date(
      string.split('-')[0],
      string.split('-')[1] - 1,
      string.split('-')[2]
    );
    var dys=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var str=dys[dt.getDay()] + ', ' + pretty_date(string, 'no');
    return str;
  }}
function save_date_format(ele) {  update_preference({date_format: ele.getAttribute('value')});
  _date_format=ele.getAttribute('value');
  var opts=$id('date_format_interior').getElementsByTagName('DIV');
  for (var i=0; i < opts.length; i++) {    if (
      opts[i].getAttribute('value') != null &&
      opts[i].getAttribute('value') != undefined
    ) {      opts[i].className =
        opts[i].getAttribute('value') == _date_format
          ? 'option option2 option_small selected'
          : 'option option2 option_small';
    }
  }
  load_gantt();
}
function find_holidays(project_id) {  if (_projects[_projects_key[project_id]]['project_include_holidays'] == 1) {    return _projects[_projects_key[project_id]]['holidays'];
  } else {    return [];
  }}
function date_to_ymd(string) {  var dt=new Date(string);
  var year=dt.getFullYear();
  var month=dt.getMonth() * 1 + 1;
  month=month < 10 ? '0' + month : month;
  var day=dt.getDate();
  day=day < 10 ? '0' + day : day;
  return year + '-' + month + '-' + day;
}
function clean_array(array) {  var temp=[];
  for (var i=0; i < array.length; i++) {    if (array[i] != undefined) {      var len=temp.length;
      temp[len]=array[i];
    }
  }
  return temp;
}
function expand_collapse_all(direction) {  for (var g=0; g < _groups.length; g++) {    var ele=null;
    if (_version == 'gantt_chart') {      ele=$id('category_title_' + _groups[g]['group_id']);
    } else if (_version == 'list_view') {      ele=$id('category_target_' + _groups[g]['group_id']);
    }
    if (ele.getAttribute('group_hidden') != 2) {      if (direction == 'expand') {        hide_group(_groups[g]['group_id'], 0);
        save_value('group-hide', _groups[g]['group_id'], '');
      } else if (direction == 'collapse') {        hide_group(_groups[g]['group_id'], 1);
        save_value('group-hide', _groups[g]['group_id'], 1);
      }
    }
  }
  load_critical_paths();
  track_segment_event('gantt-clicked-expand-collapse-all');
}
//setInterval(keep_alive, 30000);
//window.onfocus=function() { keep_alive(); };
function keep_alive() {  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState != 4) {    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var text=ajaxRequest.responseText;
      if (text == 'alive') {      } else {        navigate_window('../home/');
      }
    } else {    }
  };
  var queryString='';
  ajaxRequest.open('POST', 'keep_alive.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function unhighlight_all() {  //projects
  for (var i=0; i < _projects.length; i++) {    highlight_row('project', _projects[i]['project_id'], 'hover_off');
  }
  //groups
  for (var i=0; i < _groups.length; i++) {    highlight_row('category', _groups[i]['group_id'], 'hover_off');
  }
  //tasks
  for (var i=0; i < _tasks.length; i++) {    highlight_row('task', _tasks[i]['task_id'], 'hover_off');
  }}
function get_parents(task) {  var p='';
  for (var t=0; t < _tasks.length; t++) {    var cps=_tasks[t]['critical_paths'];
    if (js_in_array(task, cps) > -1) {      p += p != '' ? ',' : '';
      p += _tasks[t]['task_id'];
    }
  }
  var parents=p.split(',');
  return parents;
}
function get_all_parents() {  for (var t1=0; t1 < _tasks.length; t1++) {    var task=_tasks[t1]['task_id'];
    var parents='';
    for (var t2=0; t2 < _tasks.length; t2++) {      if (js_in_array(task, _tasks[t2]['critical_paths']) > -1) {        parents += parents != '' ? ',' : '';
        parents += _tasks[t2]['task_id'];
      }
    }
    _tasks[t1]['parents']=parents.split(',');
  }}
var _after_save_ele=null;
function update_task_color(id, color) {  new $ajax({    parent: this,
    type: 'PATCH',
    url: API_URL + 'v1/tasks/' + id,
    data: {color: color},
    response: function () {},
  });
}
/*
Obsolete categories (no longer used):
- feedback
- document
- file_description
- project-hours-disable
- project-hours-enable
- remove_self
Depreciated categories (invoked manually):
- home_bookmark
- task_color
- user_pref
- task_resource
Converted categories:
- remove_task
- remove_group
- convert_task_milestone
- convert_task_to_subtask
- critical_paths1
- remove_project
- task_star
- task_name
- percent_complete 
- group_name
- group-hide
- project_baselines
- project_baselines_remove
- task_estimated_hours
- task_estimated_hours-adjust
- task_dates
- outdent
- remove_cp
Not implemented (no new api route yet):
- message_read
- project_zoom
- request_progress
Remaining categories:
- vdnd
- vdnd_group
*/
function save_value(category, what, value, extra_queryString) {  // Move calls to the API
  switch (category) {    // projects
    case 'remove_project':
      delete_target('project', what, load_gantt);
      return;
    // groups
    case 'remove_group':
      delete_target('groups', what, load_gantt);
      return;
    case 'group_name':
      update_target('group', what, {name: value});
      return;
    case 'group-hide':
      var is_collapsed=value === 1 || value === '1';
      update_target('group', what, {is_collapsed: is_collapsed});
      return;
    // tasks
    case 'remove_task':
      delete_target('tasks', what, load_gantt);
      return;
    case 'convert_task_milestone':
      var type=value.toLowerCase();
      update_target('tasks', what, {type: type}, load_gantt);
      return;
    case 'convert_task_to_subtask':
      convert_task_to_subgroup(value);
      return;
    case 'task_star':
      var is_starred=parseInt(value) === 1;
      update_target('task', what, {is_starred: is_starred});
      return;
    case 'task_name':
      update_target('task', what, {name: value});
      return;
    case 'percent_complete':
      update_target('task', what, {percent_complete: value});
      track_segment_event('task-progress-updated');
      return;
    case 'task_estimated_hours':
    case 'task_estimated_hours-adjust':
      update_task_estimated_hours(
        what,
        value,
        category === 'task_estimated_hours-adjust'
      );
      return;
    case 'task_dates':
      update_task_dates(value, what === 'dates-hours');
      return;
    // dnd
    case 'outdent':
      handle_outdent(what, value);
      return;
  }
  extra_queryString=extra_queryString || '';
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var response=ajaxRequest.responseText;
      if (response == 'SAVE_ERROR_AUTHENTICATE') {        authenticate_error();
      } else {        if (
          category == 'vdnd' ||
          category == 'vdnd_group' ||
          category == 'outdent'
        ) {          load_gantt();
          allow_hover=true;
        }
        if (_after_save_ele != null && typeof _after_save_ele == 'object') {          _after_save_ele.click();
          _after_save_ele=null;
        }
      }
    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 0) {      //IF THE NETWORK CONNECTION IS LOST WHEN POSTING THE CHANGE - RESUBMIT IT 250ms LATER
      setTimeout(function () {        save_value(category, what, value, extra_queryString);
      }, 250);
    } else {    }
  };
  if (category == 'vdnd' || category == 'vdnd_group') {    start_load('chart');
  }
  var queryString='';
  queryString += 'category=' + category;
  queryString += '&what=' + what;
  queryString += '&value=' + tweak_text_for_get(value);
  queryString +=
    extra_queryString != '' && typeof extra_queryString != 'object'
      ? extra_queryString
      : '';
  var key_string=get_public_keys() != '' ? '?public_keys=true' : '';
  ajaxRequest.open('POST', '../schedule/save.change.php' + key_string, true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function authenticate_error() {  var div=custom_alert(
    'Sorry for the inconvenience. However, your session has expired. Please log in again to make changes.'
  );
  div.onclick=function () {    window.location.reload();
  };
}
function newAppAlert(messageTitle, messageBody, buttonText) {  var bg=build_background_cover();
  bg.id='custom_alert_cover';
  bg.style.cursor='default';
  bg.onclick=hide_backdrop;
  bring_to_front(bg);
  var interior=$create('DIV');
  interior.id='custom_alert_message_new_app';
  interior.onclick=function (e) {    e.stopPropagation();
  };
  bg.appendChild(interior);
  var closeButton=$create('DIV');
  closeButton.className='close-button';
  closeButton.innerHTML='x';
  closeButton.onclick=hide_backdrop;
  interior.appendChild(closeButton);
  if (messageTitle !== undefined && messageTitle !== null) {    var messageTitleDiv=$create('DIV');
    messageTitleDiv.className='messageTitle';
    messageTitleDiv.innerHTML=messageTitle;
    interior.appendChild(messageTitleDiv);
  }
  if (messageBody !== undefined && messageBody !== null) {    var messageBodyDiv=$create('DIV');
    messageBodyDiv.className='messageBody';
    messageBodyDiv.innerHTML=messageBody;
    interior.appendChild(messageBodyDiv);
  }
  if (buttonText !== undefined && buttonText !== null) {    var button=$create('DIV');
    button.className='button';
    button.appendChild($text(buttonText));
    interior.appendChild(button);
  }
  return {    title: messageTitleDiv || null,
    body: messageBodyDiv || null,
    button: button || null,
  };
}
function pluralize_target(target) {  return target.substr(-1) === 's' ? target : target + 's';
}
function is_numeric(number) {  return !isNaN(parseInt(number));
}
function handle_response(callback) {  return function (response) {    var jsonBody=null;
    try {      var jsonBody=json_decode(response.responseText);
    } catch (e) {      // do nothing
    }
    var isOk=response && response.status >= 200 && response.status < 300;
    var errorMessage=isOk ? null : 'Something went wrong, please try again.';
    if (jsonBody && jsonBody.error && jsonBody.error.message) {      errorMessage=jsonBody.error.message;
    }
    if (callback) {      return callback(
        Object.assign(response, {          json: jsonBody,
          ok: isOk,
          errorMessage: errorMessage,
        })
      );
    }
  };
}
function delete_target(target, target_id, callback) {  if (!is_numeric(target_id)) {    return;
  }
  new $ajax({    type: 'DELETE',
    url: API_URL + 'v1/' + pluralize_target(target) + '/' + target_id,
    response: handle_response(callback),
  });
}
function create_target(target, body, callback) {  new $ajax({    type: 'POST',
    url: API_URL + 'v1/' + pluralize_target(target),
    data: body,
    response: handle_response(callback),
  });
}
function update_target(target, target_id, body, callback) {  if (!is_numeric(target_id)) {    return;
  }
  update_any_target(target, target_id, body, callback);
}
function update_any_target(target, target_id, body, callback) {  new $ajax({    type: 'PATCH',
    url: API_URL + 'v1/' + pluralize_target(target) + '/' + target_id,
    data: body,
    response: handle_response(callback),
  });
}
function convert_task_to_subgroup(task_id) {  if (!is_numeric(task_id)) {    return;
  }
  new $ajax({    type: 'POST',
    url: API_URL + 'v1/tasks/' + task_id + '/convert_to_subgroup',
    response: handle_response(load_gantt),
  });
}
function update_preference(preferences) {  new $ajax({    type: 'PATCH',
    url: API_URL + 'v1/current_user/preferences_old',
    data: preferences,
    response: handle_response(),
  });
}
function update_preference_new(preference) {  new $ajax({    type: 'PUT',
    url: API_URL + 'v1/current_user/preferences',
    data: preference,
    response: handle_response(),
  });
}
function load_current_user() {  function publishData(response) {    if (!response.ok) {      return;
    }
    tgEvents.publish(tgEvents.CURRENT_USER_LOADED, response.json);
  }
  $ajax({    type: 'GET',
    url: API_URL + 'v1/current_user',
    response: handle_response(publishData),
  });
}
/**
 *
 * @param {number} task_id
 * @param {object} resource
 * @param {string} resource.type
 * @param {number} resource.type_id
 * @param {number=} resource.hours_per_day
 * @param {number=} resource.total_hours
 * @callback callback
 */
function create_task_resource(task_id, resource, callback) {  if (!is_numeric(task_id)) {    return;
  }
  return create_target(
    'tasks/' + task_id + '/resources',
    resource,
    function (response) {      if (response.json.color) {        set_task_color('task', task_id, response.json.color);
      }
      if (!response.ok && response.status !== 409) {        custom_alert(response.errorMessage);
      }
      track_segment_event('resource assigned');
      if (callback) {        callback(response);
      }
    }
  );
}
function update_task_resource(task_id, resource_id, resource, callback) {  if (!is_numeric(task_id) || !is_numeric(resource_id)) {    return;
  }
  return update_target(
    'tasks/' + task_id + '/resources',
    resource_id,
    resource,
    callback
  );
}
function delete_task_resource(task_id, resource_id, callback) {  if (!is_numeric(task_id) || !is_numeric(resource_id)) {    return;
  }
  return delete_target(
    'tasks/' + task_id + '/resources',
    resource_id,
    function (response) {      if (!response.ok && response.status !== 403) {        custom_alert(response.errorMessage);
      }
      callback && callback(response);
    }
  );
}
function update_task(task_id, body, query_params, callback) {  query_params=query_params || '';
  if (!is_numeric(task_id)) {    return;
  }
  new $ajax({    type: 'PATCH',
    url: API_URL + 'v1/tasks/' + task_id + '?' + query_params,
    data: body,
    response: handle_response(callback),
  });
}
function update_task_estimated_hours(task_id, estimated_hours, should_adjust) {  if (!is_numeric(estimated_hours)) {    return;
  }
  update_task(
    task_id,
    {estimated_hours: estimated_hours},
    'assigned_hours_set=' +
      (should_adjust ? 'total_hours_adjust' : 'total_hours_keep'),
    function (data) {      if (data.status === 200) {        var json=JSON.parse(data.responseText);
        if (should_adjust) {          var assigned_hours=0;
          var resources=json.resources;
          for (var r=0; r < resources.length; r++) {            var resource=resources[r];
            assigned_hours += resource.total_hours * 1;
            if (
              _tasks[_tasks_key[task_id]][resource.type + '_resources'][
                resource.type_id
              ]
            ) {              _tasks[_tasks_key[task_id]][resource.type + '_resources'][
                resource.type_id
              ]['hours_per_day']=resource.hours_per_day;
              _tasks[_tasks_key[task_id]][resource.type + '_resources'][
                resource.type_id
              ]['total_hours']=resource.total_hours;
            }
          }
          _tasks[_tasks_key[task_id]]['assigned_hours']=assigned_hours;
        }
        display_resource_view('nosave');
        update_hours_indicator(task_id);
        refresh_task_resources(task_id);
      }
    }
  );
}
function update_task_dates(raw_value, default_update_hours, callback) {  var update_hours=default_update_hours || false;
  // is seconds needed anymore?
  var save_second_split=raw_value.split('&second=');
  var value=save_second_split[0];
  var tasks=value.split(';');
  var promises=tasks.map(
    function (task) {      var d1=task.split(':');
      var d2=d1[1] ? d1[1].split(',') : '';
      var task_id=d1[0];
      var start_date=d2[0];
      var end_date=d2[1] || '';
      if (start_date === 'null' || end_date === 'null') {        start_date=null;
        end_date=null;
      }
      return new Promise(
        function(resolve) {          return update_task(
            task_id,
            {start_date: start_date, end_date: end_date},
            update_hours
              ? 'assigned_hours_set=total_hours_adjust'
              : 'assigned_hours_set=total_hours_keep',
            function (response) {              if (response.status === 200) {                var json=JSON.parse(response.responseText);
                var days=json.days;
                var estimated_hours=json.estimated_hours;
                var assigned_hours=0;
                if (_tasks[_tasks_key[task_id]]) {                  // API does not have a concept of weeks,
                  // update to 0 to not break duration calculations
                  _tasks[_tasks_key[task_id]]['weeks']=0;
                  _tasks[_tasks_key[task_id]]['days']=days;
                  _tasks[_tasks_key[task_id]]['total_days']=days;
                  _tasks[_tasks_key[task_id]]['estimated_hours']=estimated_hours;
                  if ($id('task_estimated_hours_' + task_id)) {                    var div=$id('task_estimated_hours_' + task_id);
                    remove_child_nodes(div);
                    div.appendChild($text(estimated_hours));
                  }
                  var resources=json.resources;
                  resources.forEach(function (resource) {                    var resource_type=resource.type;
                    var resource_id=resource.type_id;
                    var hours_per_day=resource.hours_per_day;
                    var total_hours=resource.total_hours;
                    assigned_hours += total_hours * 1;
                    var key=resource_type === 'project' ? 'resources' : resource_type + '_resources';
                    if (
                      _tasks[_tasks_key[task_id]][key][resource_id]
                    ) {                      _tasks[_tasks_key[task_id]][key][resource_id]['hours_per_day']=hours_per_day;
                      _tasks[_tasks_key[task_id]][key][resource_id]['total_hours']=total_hours;
                    }
                  });
                  _tasks[_tasks_key[task_id]]['assigned_hours']=assigned_hours;
                  refresh_task_resources(task_id);
                  if (
                    $id('task_div_hours_' + task_id) &&
                    typeof display_actual_hours_bar == 'function'
                  ) {                    display_actual_hours_bar(task_id);
                  }
                }
                resolve();
              }
            }
          );
        }
      );
    }
  );
  Promise.any(promises).then(function (result) {    update_group_bar();
    // wait for the snap transition effect to complete before redrawing lines
    window.setTimeout(function() {      remove_child_nodes($id("critical_paths"));
      load_critical_paths("xx");
    }, 250);
  });
  Promise.all(promises).then(function (result) {    callback();
  });
}
/**
 * Outdents the target
 * @param {('group'|'task')} target_type
 * @param {number} target_id
 */
function handle_outdent(target_type, target_id) {  if (!is_numeric(target_id)) {    return;
  }
  var target;
  var parent_group_id;
  var new_sort;
  if (target_type === 'task') {    target=_tasks[_tasks_key[target_id]];
    parent_group_id=target['group_id'];
  } else if (target_type === 'group') {    target=_groups[_groups_key[target_id]];
    parent_group_id=target['parent_group_id'];
  } else {    return;
  }
  move_target(target_type, target_id, 'group', parent_group_id, 'after');
}
/**
 * Handles moving a target
 * @param {('group'|'task')} target_type
 * @param {number} target_id
 * @param {('group'|'task')} parent_type
 * @param {number} parent_id
 * @param {('before'|'after')} direction
 */
function move_target(
  target_type,
  target_id,
  parent_type,
  parent_id,
  direction
) {  var parent;
  var parent_group_id;
  if (parent_type == 'task') {    parent=_tasks[_tasks_key[parent_id]];
    parent_group_id=parent['group_id'];
  } else if (parent_type === 'group') {    parent=_groups[_groups_key[parent_id]];
    parent_group_id=parent['parent_group_id'] || null;
  } else {    return;
  }
  var sort=parent['sort_order'] + (direction === 'after' ? 1 : 0);
  update_target(
    target_type,
    target_id,
    {      parent_group_id: parent_group_id,
      sort: sort,
    },
    function (response) {      if (response.status === 200) {        load_gantt();
      }
    }
  );
}
function make_new_app_query(params={}, options={}) {  var query='?';
  var public_keys=params.public_keys
    ? params.public_keys.filter(function (id) {        return id !== 'LOGIN';
      })
    : [];
  if (params.project_ids.length > 0) {    query += params.project_ids
      .map(function (id) {        return 'ids=' + id;
      })
      .join('&');
  }
  if (public_keys.length > 0 || options.is_iframe_view) {    query += params.project_ids
      .map(function (id) {        return '&projectIds=' + id;
      })
      .join('');
    query += public_keys
      .map(function (id) {        return '&publicKeys=' + encodeURIComponent(id);
      })
      .join('');
  }
  if (params.user_resources.length > 0) {    query += params.user_resources
      .map(function (id) {        return '&userResourceIds=' + id;
      })
      .join('');
  }
  if (params.company_resources.length > 0) {    query += params.company_resources
      .map(function (id) {        return '&companyResourceIds=' + id;
      })
      .join('');
  }
  if (params.project_resources.length > 0) {    query += params.project_resources
      .map(function (id) {        return '&projectResourceIds=' + id;
      })
      .join('');
  }
  if (params.color_filter.length > 0) {    query += params.color_filter
      .map(function (id) {        return '&taskColors=' + id;
      })
      .join('');
  }
  if (params.date_filter != '') {    var webClientDateFilter;
    switch (params.date_filter) {      case 'inprogress':
        webClientDateFilter='inProgress';
        break;
      case 'duetoday':
        webClientDateFilter='dueToday';
        break;
      case 'due1week':
        webClientDateFilter='dueOneWeek';
        break;
      case 'due2week':
        webClientDateFilter='dueTwoWeeks';
        break;
      case 'due1month':
        webClientDateFilter='dueFourWeeks';
        break;
      case 'start1week':
        webClientDateFilter='startOneWeek';
        break;
      case 'start2week':
        webClientDateFilter='startTwoWeeks';
        break;
      case 'start4week':
        webClientDateFilter='startFourWeeks';
        break;
      case 'today':
        webClientDateFilter='remainingToday';
        break;
      case 'onlymilestones':
        webClientDateFilter='onlyMilestones';
        break;
      case 'notscheduled':
        webClientDateFilter='notScheduled';
        break;
      default:
        webClientDateFilter=params.date_filter;
    }
    if (webClientDateFilter) {      query += '&status=' + webClientDateFilter;
    }
  }
  if (params.hide_completed === true) {    query += '&hideCompleted=' + true;
  }
  if (public_keys.length > 0) {    query += '&prefs=' + encodeURIComponent(btoa(window.location.search));
  }
  if (params.onload) {    query += '&onload=' + params.onload;
  }
  return query;
}
// JavaScript Document
////// CONTROLS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function remove_selection() {  //REMOVE SELECTION
  if (document.selection) {    document.selection.empty();
  } else if (window.getSelection) {    window.getSelection().removeAllRanges();
  }}
//CURSOR POSITION
var _mouseX=null;
var _mouseY=null;
var _move_type=null;
var _start_mouseX=null;
var _start_mouseY=null;
var _cp_y_offset=-15;
var _draw_task_allow=true;
var _draw_task=null;
var _draw_task_offset=0;
function start_move(move_type) {  _move_type=move_type;
  window.onmouseup=finish_move;
  document.onmouseup=finish_move;
  if (move_type == 'scroll') {    var sc=$id('scroll_container');
    var sb=$id('scroll_bar');
    sb.className += ' no_transition';
    var subtract_left=sb.offsetLeft;
    sb.setAttribute('subtract_left', subtract_left);
  } else if (move_type == 'resource_view') {    $id('resource_view').setAttribute(
      'off_height',
      $id('resource_view').offsetHeight
    );
    allow_hover=false;
  } else if (move_type == 'task_draw') {    _draw_task_offset=$id('meta_data')
      ? $id('meta_data').offsetWidth * -1
      : 0;
    _draw_task_offset += $id('category_task_list').offsetWidth * -1;
    _draw_task_offset -= find_day_width() * 0.5;
    allow_hover=false;
    allow_hover=false;
  }
  _cp_y_offset=$id('task_box').offsetTop + $id('header').offsetHeight - 10;
  if (get_is_embedded_view()) {    _cp_y_offset += 25;
  }
  document.onmousemove=getMousePos;
  disableSelection(document.body);
}
function finish_move() {  if (_move_type == 'scroll') {    $id('tasks').scrollLeft=$id('task_header').scrollLeft;
    match_scrolls();
    $id('scroll_bar').className=trim(
      $id('scroll_bar').className.replace(/no_transition/g, '')
    );
  } else if (_move_type == 'resource_view') {    _resource_view_height=$id('resource_view_list').offsetHeight;
    allow_hover=true;
    // UPDATE CUSTOMIZED VIDEOS POSITION
    if (typeof positionCustomizedVideosPanel === 'function') {      positionCustomizedVideosPanel();
    }
  } else if (_move_type == 'task_draw') {    if (_draw_task.indexOf('new-task') == -1) {      var ele=$id('task_div_' + _draw_task);
      if (_start_mouseX == null && _mouseX == null && _page_mouseX != null) {        var scroller=$id('tasks').scrollLeft * 1 + _page_mouseX;
        scroller += _draw_task_offset;
        var dates1=find_date(scroller, find_day_width());
        _tasks[_tasks_key[_draw_task]]['start_date']=dates1;
        _tasks[_tasks_key[_draw_task]]['end_date']=dates1;
        var dates=[dates1, dates1];
        update_position(ele, 'task', dates1, dates1);
      } else {        var dates=find_date(ele, find_day_width());
        update_position(ele, 'task', dates[0], dates[1]);
      }
      var save_string=_draw_task + ':' + dates[0] + ',' + dates[1];
      save_value('task_dates', 'dates', save_string);
      track_segment_event('gantt-created-a-task-bar');
      ele.parentNode.onmousedown=null;
      if (
        $id('task_details_' + _draw_task) &&
        $id('task_details_' + _draw_task).firstChild &&
        $id('task_details_' + _draw_task).firstChild.firstChild
      ) {        $id('task_details_' + _draw_task).firstChild.firstChild.className='';
      }
    } else {      var ele=$id('task_div_' + _draw_task);
      if (_start_mouseX != null) {        var dates=find_date(ele, find_day_width());
        _tasks[_tasks_key[_draw_task]]['start_date']=dates[0];
        _tasks[_tasks_key[_draw_task]]['end_date']=dates[1];
        update_position(ele, 'task', dates[0], dates[1]);
      } else {        var scroller=$id('tasks').scrollLeft * 1 + _page_mouseX;
        scroller += _draw_task_offset;
        var dates=find_date(scroller, find_day_width());
        _tasks[_tasks_key[_draw_task]]['start_date']=dates;
        _tasks[_tasks_key[_draw_task]]['end_date']=dates;
        update_position(ele, 'task', dates, dates);
      }
      ele.parentNode.onmousedown=null;
      if (
        $id('task_details_' + _draw_task) &&
        $id('task_details_' + _draw_task).firstChild &&
        $id('task_details_' + _draw_task).firstChild.firstChild
      ) {        $id('task_details_' + _draw_task).firstChild.firstChild.className='';
      }
    }
    set_arrows();
    load_critical_paths();
    _draw_task=null;
  }
  _move_type=null;
  _start_mouseX=null;
  _start_mouseY=null;
  allow_hover=true;
  unhighlight_all();
  delete mouseX;
  delete mouseY;
  window.onmouseup=null;
  document.onmouseup=null;
  document.onmousemove=null;
  enableSelection(document.body);
}
var _page_mouseX=0;
var _page_mouseY=0;
function getMousePos(e) {  _page_mouseX =
    window.Event && document.captureEvents
      ? e.pageX
      : event.clientX +
        (document.documentElement.scrollLeft
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft);
  _page_mouseX -= sidebar_width();
  _page_mouseY =
    window.Event && document.captureEvents
      ? e.pageY
      : event.clientY +
        (document.documentElement.scrollTop
          ? document.documentElement.scrollTop
          : document.body.scrollTop);
  if (_move_type != null) {    mouseX=_page_mouseX;
    mouseY=_page_mouseY;
    //SET THE START MOUSE POS
    _start_mouseX=_start_mouseX == null ? mouseX : _start_mouseX;
    _start_mouseY=_start_mouseY == null ? mouseY : _start_mouseY;
    if (_move_type == 'left_panel') {      adjust_left_panel_width(
        mouseX + $id('resize_bar').getAttribute('diff') * 1 + 6
      );
    } else if (_move_type == 'task_draw') {      allow_hover=false;
      var d_width=find_day_width();
      var scroller=$id('tasks').scrollLeft;
      scroller += _draw_task_offset;
      var left=_start_mouseX + scroller;
      var task=$id('task_div_' + _draw_task);
      task.style.marginLeft=left + 'px';
      var diff=mouseX - _start_mouseX + d_width * 0.5;
      diff =
        diff < d_width ||
        _tasks[_tasks_key[_draw_task]]['task_type'] == 'Milestone'
          ? d_width
          : diff;
      task.style.width=diff + 'px';
    } else if (_move_type == 'scroll') {      scroll_control();
    } else if (_move_type == 'cp_from') {      //GET THE COORDS FOR THE FROM TASK
      var from_coords=get_coords(_build_from);
      if ($id('task_div_' + _build_from)) {        from_coords[0] =
          from_coords[0] * 1 + $id('task_div_' + _build_from).offsetWidth; // +5;
      }
      //GET THE COORDS FOR THE MOUSE
      var x =
        mouseX * 1 + $id('tasks').scrollLeft - $id('tasks').offsetLeft - 5;
      //var y=mouseY - $id("tasks").firstChild.offsetTop - $id("tasks").firstChild.firstChild.offsetHeight;// - $id("hidden_row_height").offsetHeight*2;
      //var y=mouseY - $id("task_box").offsetTop - $id("hidden_row_height").offsetHeight*2;
      var y=mouseY - _cp_y_offset;
      //SET THE COORDS -- IF OVER A TASK, USE THE TASK'S CORDS
      var to_coords =
        _cp_build_task == null ? [x, y] : get_coords(_cp_build_task);
      //REMOVE THE PREIVIOUS LINE
      if ($id('cp_draw')) {        $id('cp_draw').parentNode.removeChild($id('cp_draw'));
      }
      //CREATE & APPEND THE LINES
      var box=draw_line(from_coords, to_coords);
      box.id='cp_draw';
      box.className=_cp_build_task != null ? 'hover' : '';
      $id('critical_paths').appendChild(box);
    } else if (_move_type == 'cp_to') {      //GET THE TO COORDS
      var to_coords=get_coords(_build_to);
      //GET THE COORDS FOR THE MOUSE
      var x =
        mouseX * 1 + $id('tasks').scrollLeft - $id('tasks').offsetLeft + 5;
      var y=mouseY - _cp_y_offset;
      //USE MOUSE POSITION FOR THE FROM POSITION UNLESS OVER A TASK
      if (_cp_build_task == null) {        var from_coords=[x, y];
      } else {        var from_coords=get_coords(_cp_build_task);
        from_coords[0] =
          from_coords[0] * 1 + $id('task_div_' + _cp_build_task).offsetWidth;
      }
      //REMOVE THE PREVIOUS LINE
      if ($id('cp_draw')) {        $id('cp_draw').parentNode.removeChild($id('cp_draw'));
      }
      //CREATE & APPEND THE LINES
      var box=draw_line(from_coords, to_coords);
      box.id='cp_draw';
      box.className=_cp_build_task != null ? 'hover' : '';
      $id('critical_paths').appendChild(box);
    } else if (_move_type == 'resource_view') {      set_resource_height();
    }
  }}
function workloads_positioning_based_on_footer() {  const resource_bar=$id('resource_view_tab_bar');
  const footer=$id('footer');
  if (!resource_bar) {    return;
  }
  if (!footer) {    resource_bar.style.bottom=0;
    return;
  }
  resource_bar.style.removeProperty('bottom');
}
function set_resource_height() {  var rlist=$id('resource_view_list');
  var rview=$id('resource_view');
  var rbar=$id('resource_view_tab_bar');
  if (rlist && rview && rbar) {    if (typeof mouseY != 'undefined') {      var start_height=rview.getAttribute('off_height');
      var diff=_start_mouseY - mouseY;
      var height=start_height * 1 + diff * 1 - 5;
    } else {      var height=rview.offsetHeight;
    }
    var window_height=window_size('height');
    if (height > window_height * 0.7) {      height=window_height * 0.7;
    } else if (height < 50) {      height=50;
    }
    rview.style.height=height + 'px';
    rview.style.maxHeight=height + 'px';
    rlist.style.height=height + 'px';
    rlist.style.maxHeight=height + 'px';
    rbar.style.marginBottom=height + 'px';
    workloads_positioning_based_on_footer();
    set_resource_view_scroll();
    // UPDATE CUSTOMIZED VIDEOS POSITION
    if (typeof positionCustomizedVideosPanel === 'function') {      positionCustomizedVideosPanel();
    }
  }}
var _save_timeout=null;
var _adjust_left_panel_width_save=0;
function adjust_left_panel_width(x) {  var project_id=_projects[0]['project_id'];
  var percent_complete=$id('project_percent_complete_' + project_id);
  var percent_complete_width=percent_complete ? percent_complete.offsetWidth : 0;
  var assigned_resources=$id('project_assigned_resources_' + project_id);
  var assigned_resources_width=assigned_resources ? assigned_resources.offsetWidth : 0;
  var actual_hours=$id('actual_hours_' + project_id);
  var actual_hours_width=actual_hours ? actual_hours.offsetWidth : 0;
  var estimated_hours=$id('project_estimated_hours_' + project_id);
  var estimated_hours_width=estimated_hours ? estimated_hours.offsetWidth : 0;
  var meta_column=$id('meta_data');
  var meta_column_width=meta_column ? meta_column.offsetWidth*2 : 0;
  var min_offset_width=percent_complete_width + assigned_resources_width + actual_hours_width + estimated_hours_width + meta_column_width;
  var min_left=min_offset_width + 110;
  allow_hover=false;
  x=x * 1;
  var spacer=$id('spacer');
  var meta=$id('meta_data');
  var meta_width=meta && meta.className == '' ? meta.offsetWidth - 2 : -2;
  spcr=x * 1 + meta_width;
  spcr=spcr < min_left ? min_left : spcr;
  x=spcr - meta_width;
  var max_width=window.innerWidth * 0.8;
  var requested_spacer_width=spcr - meta_width;
  var requested_list_width=x - meta_width;
  var diff=requested_list_width - requested_spacer_width;
  var list_width=Math.min(requested_list_width, max_width);
  var spacer_width=list_width - diff;
  spacer.style.width=spacer_width + 'px';
  $id('category_task_list').style.width=list_width + 'px';
  var spacer_width=spacer.offsetWidth;
  var mnths=$id('task_header').getElementsByTagName('DIV');
  var m_length=mnths.length;
  for (var m=0; m < m_length; m++) {    if (mnths[m].className == 'task_months') {      var def_left=mnths[m].getAttribute('def_left') * 1;
      mnths[m].style.marginLeft=def_left + spacer_width + 'px';
      mnths[m].setAttribute('var_left', def_left);
      mnths[m].style.left='0';
    }
  }
  _left_width=x;
  set_scroll_bar();
  match_scrolls();
  setTimeout(remove_selection, 10);
  clearTimeout(_save_timeout);
  resource_view_name_width($id('resource_view_list'));
  if (_version == 'gantt_chart' && _adjust_left_panel_width_save > 2) {    _save_timeout=setTimeout(function() {      update_preference({left_width2: x});
    }, 1000);
  }
  _adjust_left_panel_width_save++;
  set_column_bars();
}
function remove_selection() {  //REMOVE SELECTION
  if (document.selection) {    document.selection.empty();
  } else if (window.getSelection) {    window.getSelection().removeAllRanges();
  }}
function disableSelection(target, cursor) {  if (target) {    target.className +=
      target.className.indexOf('hide_selection') == -1 ? ' hide_selection' : '';
    cursor=cursor || 'default';
    if (typeof target.onselectstart != 'undefined')
      //IE route
      target.onselectstart=function() {        return false;
      };
    else if (typeof target.style.MozUserSelect != 'undefined')
      //Firefox route
      target.style.MozUserSelect='none';
    //All other route (ie: Opera)
    else
      target.onmousedown=function() {        return false;
      };
    target.style.cursor=cursor;
  }}
function enableSelection(target) {  if (target) {    target.className=trim(target.className.replace(/hide_selection/g, ''));
    if (typeof target.onselectstart != 'undefined')
      //IE route
      target.onselectstart=function() {        return true;
      };
    else if (typeof target.style.MozUserSelect != 'undefined')
      //Firefox route
      target.style.MozUserSelect='';
    //All other route (ie: Opera)
    else
      target.onmousedown=function() {        return true;
      };
    target.style.cursor='default';
  }}
//HOVER OVER ROW
function unhighlight_all(keep_type, keep_id) {  if (typeof _tasks == 'array' || typeof _tasks == 'object') {    var tl=_tasks.length;
    for (var i=0; i < tl; i++) {      if (keep_type == 'task' && keep_id == _tasks[i]['task_id']) {        //skip this row
      } else {        highlight_row('task', _tasks[i]['task_id'], 'force_off');
      }
    }
  }
  if (typeof _groups == 'array' || typeof _groups == 'object') {    var gl=_groups.length;
    for (var i=0; i < gl; i++) {      if (keep_type == 'group' && keep_id == _groups[i]['group_id']) {        //skip this row
      } else {        highlight_row('group', _groups[i]['group_id'], 'force_off');
        highlight_row(
          'task',
          'quick_add_' + _groups[i]['group_id'],
          'force_off'
        );
      }
    }
  }
  if (typeof _projects == 'array' || typeof _projects == 'object') {    var pl=_projects.length;
    for (var i=0; i < pl; i++) {      if (keep_type == 'project' && keep_id == _projects[i]['project_id']) {        //skip this row
      } else {        highlight_row('project', _projects[i]['project_id'], 'force_off');
      }
    }
  }}
function unhighlight_all_no_force(keep_type, keep_id) {  if (typeof _tasks == 'array') {    var tl=_tasks.length;
    for (var i=0; i < tl; i++) {      if (keep_type == 'task' && keep_id == _tasks[i]['task_id']) {        //skip this row
      } else {        highlight_row('task', _tasks[i]['task_id'], 'hover_off');
      }
    }
    var gl=_groups.length;
    for (var i=0; i < gl; i++) {      if (keep_type == 'group' && keep_id == _groups[i]['group_id']) {        //skip this row
      } else {        highlight_row('group', _groups[i]['group_id'], 'hover_off');
        highlight_row(
          'task',
          'quick_add_' + _groups[i]['group_id'],
          'hover_off'
        );
      }
    }
    var pl=_projects.length;
    for (var i=0; i < pl; i++) {      if (keep_type == 'project' && keep_id == _projects[i]['project_id']) {        //skip this row
      } else {        highlight_row('project', _projects[i]['project_id'], 'hover_off');
      }
    }
  }}
//DELAY HIGHLIGHT
function delay_highlight(type, row, which) {  setTimeout(function() {    highlight_row(type, row, which);
  }, 250);
}
var _hover_type='';
var _hover_row='';
var _highlight_counts=0;
var allow_hover=true;
function highlight_row(type, row, which) {  if (_version == 'gantt_chart') {    type=type == 'group' ? 'category' : type;
    var highlight_types=[];
    highlight_types['hover_on']='active';
    highlight_types['hover_on_force']='active';
    highlight_types['moving_up']='moving_up';
    highlight_types['moving_highlight']='moving_highlight';
    highlight_types['moving_highlight2']='moving_highlight';
    highlight_types['selected']='moving';
    highlight_types['moving']='moving';
    highlight_types['moving_force']='moving';
    highlight_types['remove']='remove';
    highlight_types['badges']='show_badges';
    highlight_types['badges_force']='show_badges';
    highlight_types['editing_row']='editing_row';
    highlight_types['hover_off']=null;
    var meta=$id(type + '_meta_' + row);
    var left=$id(type + '_title_' + row);
    var right=$id(type + '_' + row);
    var quick_add=$id('quick_add_' + type + '_' + row);
    //SEE IF THEY CAN EDIT THE WHOLE ROW
    if (which == 'editing_row' && type == 'task') {      var project_permission =
        _projects[_projects_key[_tasks[_tasks_key[row]]['project_id']]][
          'project_permission'
        ];
      if (project_permission == '') {        right=null;
        highlight_row(type, row, 'selected');
      }
    }
    if (allow_hover || which.indexOf('force') > -1) {      if (right != null) {        if (which == 'force_off') {          if (right.getAttribute('dont_clear') == null) {            right.removeAttribute('lock_off');
          }
        }
        if (
          right.getAttribute('lock_off') != 1 &&
          (which == 'hover_off' || which == 'force_off')
        ) {          _hover_type='';
          _hover_row='';
          for (var i in highlight_types) {            if (
              highlight_types[i] != null &&
              i.toLowerCase() != 'indexof' &&
              i.toLowerCase() != 'map' &&
              highlight_types[i] != null &&
              i != 'filter'
            ) {              var regex=new RegExp(highlight_types[i], 'g');
              if (meta) {                meta.className=trim(meta.className.replace(regex, ''));
              }
              left.className=trim(left.className.replace(regex, ''));
              right.className=trim(right.className.replace(regex, ''));
            }
          }
          highlight_cps(type, row, 'remove');
        } else if (which != 'hover_off' && which != 'force_off') {          //BUILD THE LINE THAT WILL ALLOW YOU TO REORDER OR NEST
          if (meta) {            meta.className +=
              meta.className.indexOf(highlight_types[which]) == -1
                ? ' ' + highlight_types[which]
                : '';
          }
          left.className +=
            left.className.indexOf(highlight_types[which]) == -1
              ? ' ' + highlight_types[which]
              : '';
          right.className +=
            right.className.indexOf(highlight_types[which]) == -1
              ? ' ' + highlight_types[which]
              : '';
          if (which == 'remove' || which == 'moving_highlight') {            //FOR THINGS THAT NEED TO BE HIGHLIGHT TO CHANGE COLOR
            highlight_row(type, row, 'hover_on_force');
          } else if (
            _multi_select.move_direction == 'vertical' &&
            row.indexOf('quick') > -1 &&
            which != 'moving_highlight2'
          ) {            //HIGHLIGHTS THE QUICK ADD ROW FOR DROPPING THINGS IN THERE
            highlight_row(type, row, 'moving_highlight2');
          } else if (
            _multi_select.vdnd_from == 'left' &&
            _multi_select.in_action == true &&
            which == 'hover_on' &&
            row.indexOf('quick') == -1
          ) {            //IF FROM THE LEFT AND NOT A QUICK ADD, SHOW TO PLACE AFTER
            highlight_row(type, row, 'moving_up');
          }
          if (
            _multi_select.move_direction == 'vertical' &&
            row.indexOf('quick') == -1 &&
            which != 'moving_highlight' &&
            which != 'moving_highlight2' &&
            which != 'hover_on_force'
          ) {            if (js_in_array(row, _multi_select.element_ids) == -1) {              //REMOVE THE ROW HIGHLIGHT
              meta=meta == null ? $id('header_values') : meta;
              _multi_select.line_selection(meta, left, right);
            }
          }
          if (which == 'hover_on') {            _hover_type=type;
            _hover_row=row;
            if (
              type == 'task' &&
              _multi_select.move_direction != 'vertical' &&
              right.className.indexOf('show_badges') == -1
            ) {              right.className += ' show_badges';
            }
            highlight_cps(type, row, 'highlight');
          }
        }
      }
    }
    //TASK DRAW
    if (
      type == 'task' &&
      right != null &&
      right.getAttribute('nodate') == 'true'
    ) {      if (
        which == 'hover_on' &&
        row != null &&
        (_move_type == '' || _move_type == null)
      ) {        set_task_caption(row);
      } else if (which == 'hover_off' || which == 'force_off') {        var ele=$id('task_div_' + row);
        if (ele) {          ele.style.marginLeft='-1003px';
          ele.style.width='0px';
          ele.parentNode.onmousemove=null;
        }
      }
    }
  }}
function set_task_caption(row) {  var ele=$id('task_' + row);
  if (ele.className.indexOf('moving') == -1) {    // && (allow_hover == true || row.indexOf("new") > -1))
    var day_width=find_day_width();
    var x=_page_mouseX * 1;
    x += $id('tasks').scrollLeft * 1;
    x -= $id('tasks').offsetLeft * 1;
    x -= day_width * 0.5;
    var ele=$id('task_div_' + row);
    if (ele) {      ele.style.marginLeft=x + 'px';
      ele.style.width=day_width + 'px';
      ele.parentNode.onmousemove=function() {        set_task_caption(ele.parentNode.getAttribute('task_id'));
      };
    }
    ele.parentNode.onmousemove=function() {      set_task_caption(ele.parentNode.getAttribute('task_id'));
    };
  } else {    var ele=$id('task_div_' + row);
    ele.style.marginLeft='-1004px';
    ele.style.width=day_width + 'px';
  }}
function highlight_cps(type, row, direction) {  if (type == 'task') {    var class_name=direction == 'highlight' ? 'hover' : '';
    var cps=$id('critical_paths').getElementsByTagName('DIV');
    var cpl=cps.length;
    for (var i=0; i < cpl; i++) {      var id=cps[i].id;
      var ids=id.split('_');
      if (js_in_array(row, ids) > -1) {        cps[i].className=class_name;
      }
    }
  }}
//INLINE EDIT TASK
function inline_edit_task(ele, do_focus) {  ele.setAttribute('contenteditable', true);
  ele.parentNode.className += ' focus';
  var task_id=ele.getAttribute('task_id');
  highlight_row('task', task_id, 'hover_on');
  ele.onfocus=function() {    unhighlight_all();
    highlight_row('task', this.getAttribute('task_id'), 'hover_on');
    highlight_row('task', this.getAttribute('task_id'), 'editing_row');
    allow_hover=false;
    if (this.getAttribute('task_id').indexOf('new-task') > -1) {      var tip=$create('DIV');
      tip.className='new_task_tip';
      var margin_left=this.offsetLeft;
      var meta_width=0;
      if ($id('meta_data')) {        meta_width=$id('meta_data').offsetWidth;
      }
      margin_left += meta_width;
      tip.style.marginLeft='-' + margin_left * 1 + 'px';
      tip.style.left=this.offsetLeft + 'px';
      tip.style.paddingLeft=meta_width + 'px';
      tip.style.marginTop='3px';
      //SPACER
      var spacer=$create('DIV');
      spacer.style.display='inline-block';
      spacer.style.width=this.offsetLeft + 'px';
      spacer.style.paddingLeft='10px';
      spacer.style.height='1.5em';
      tip.appendChild(spacer);
      //LINK 1
      var link1=$create('SPAN');
      link1.onmousedown=function() {        if (
          $id('task_name_' + this.parentNode.parentNode.getAttribute('task_id'))
            .firstChild.nodeValue == ''
        ) {          this.parentNode.parentNode.removeChild(this.parentNode);
          document.activeElement.blur();
        } else {          document.activeElement.blur();
        }
      };
      link1.appendChild($text("I'm done adding tasks"));
      tip.appendChild(link1);
      tip.appendChild($text(' | '));
      //LINK 2
      var link2=$create('SPAN');
      link2.onmousedown=function() {        switch_task(this.parentNode.parentNode.getAttribute('task_id'));
      };
      var switch_word='Milestone';
      switch_word =
        _tasks[_tasks_key[ele.getAttribute('task_id')]]['task_type'] == 'Task'
          ? 'Milestone'
          : 'Task';
      link2.appendChild($text('Change to ' + switch_word));
      tip.appendChild(link2);
      ele.parentNode.appendChild(tip);
    }
    allow_hover=true;
    highlight_row('task', this.getAttribute('task_id'), 'hover_on');
    highlight_row('task', this.getAttribute('task_id'), 'editing_row');
    allow_hover=false;
  };
  ele.onkeyup=function(event) {    var key_code=event.keyCode;
    if (key_code == _master_keys['enter']) {      //this.blur();
      return false;
    } else if (key_code == _master_keys['tab']) {      return false;
    } else if (key_code == _master_keys['escape']) {      if (this.getAttribute('task_id').indexOf('new-task') > -1) {        this.onblur=null;
        var eles=[
          $id('task_meta_' + this.getAttribute('task_id')),
          $id('task_title_' + this.getAttribute('task_id')),
          $id('task_' + this.getAttribute('task_id')),
        ];
        for (var e=0; e < eles.length; e++) {          eles[e].parentNode.removeChild(eles[e]);
        }
        //RESET CRITICAL PATHS
        load_critical_paths();
        allow_hover=true;
        unhighlight_all();
      }
      this.firstChild.nodeValue =
        _tasks[_tasks_key[this.getAttribute('task_id')]]['task_name'];
      this.blur();
    }
  };
  ele.onkeydown=function(event) {    var key_code=event.keyCode;
    if (key_code == _master_keys['enter']) {      var adding=_is_shift == false ? 'task' : 'milestone';
      if (this.getAttribute('task_id').indexOf('new-task') > -1) {        this.setAttribute('add_after', adding);
      } else {        quick_add('task', adding, this.getAttribute('task_id'), '');
      }
      this.blur();
      return false;
    } else if (key_code == _master_keys['tab']) {      _after_save_ele=select_field(this.getAttribute('task_id'), this);
      this.blur();
      return false;
    }
  };
  ele.onblur=function() {    task_id=this.getAttribute('task_id');
    this.scrollLeft=0;
    allow_hover=true;
    unhighlight_all();
    ele.parentNode.className=trim(
      ele.parentNode.className.replace(/focus/g, '')
    );
    cleanup_editable_div_text(this);
    var targets=this.parentNode.getElementsByTagName('*');
    for (i=0; i < targets.length; i++) {      if (targets[i] && targets[i].className == 'new_task_tip') {        targets[i].parentNode.removeChild(targets[i]);
      }
    }
    if (task_id.indexOf('new-task') > -1) {      if (_after_save_ele != null) {        _after_save_ele.click();
      }
      this.removeAttribute('contenteditable');
      if ($id('task_name_bar_' + task_id)) {        remove_child_nodes($id('task_name_bar_' + task_id));
        $id('task_name_bar_' + task_id).appendChild(
          $text(this.firstChild.nodeValue)
        );
      }
      if ($id('task_name_next_to_bar_' + task_id)) {        remove_child_nodes($id('task_name_next_to_bar_' + task_id));
        $id('task_name_next_to_bar_' + task_id).appendChild(
          $text(this.firstChild.nodeValue)
        );
      }
      set_save_quick_add(
        _tasks[_tasks_key[task_id]]['queryString'],
        task_id,
        this.firstChild.nodeValue,
        this.getAttribute('add_after')
      );
    } else if (
      this.firstChild.nodeValue != _tasks[_tasks_key[task_id]]['task_name']
    ) {      _tasks[_tasks_key[task_id]]['task_name']=this.firstChild.nodeValue;
      var percent_complete=_tasks[_tasks_key[task_id]]['percent_complete'];
      save_value(
        'task_name',
        task_id,
        this.firstChild.nodeValue,
        '&percent_complete=' + percent_complete
      );
      tgEvents.publish(tgEvents.TASK_RENAMED, {        id: parseInt(task_id),
        name: this.firstChild.nodeValue,
      });
      track_segment_event('gantt-renamed-a-task-from-name-column');
      if ($id('task_name_bar_' + task_id)) {        remove_child_nodes($id('task_name_bar_' + task_id));
        $id('task_name_bar_' + task_id).appendChild(
          $text(this.firstChild.nodeValue)
        );
      }
      if ($id('task_name_next_to_bar_' + task_id)) {        remove_child_nodes($id('task_name_next_to_bar_' + task_id));
        $id('task_name_next_to_bar_' + task_id).appendChild(
          $text(this.firstChild.nodeValue)
        );
      }
    } else if (_after_save_ele != null) {      _after_save_ele.click();
    }
    this.removeAttribute('contenteditable');
  };
  if (do_focus) {    ele.focus();
  }}
//INLINE
function inline_edit_group(ele) {  highlight_row(
    'category',
    ele.parentNode.getAttribute('group_id'),
    'hover_on'
  );
  highlight_row('category', ele.parentNode.getAttribute('group_id'), 'active');
  highlight_row(
    'category',
    ele.parentNode.getAttribute('group_id'),
    'editing_row'
  );
  allow_hover=false;
  var parent=ele.parentNode;
  var e_value=ele.firstChild.nodeValue;
  var div=$create('DIV');
  div.className='category_name';
  var input=$create('INPUT');
  input.className='edit_name';
  input.setAttribute('group_id', ele.parentNode.getAttribute('group_id'));
  input.setAttribute('edit_group', ele.parentNode.getAttribute('group_id'));
  input.value=e_value;
  input.setAttribute('ele_id', ele.id);
  input.setAttribute('edit_tag', 'name');
  input.setAttribute('is_cancel', 0);
  input.setAttribute('maxlength', 100);
  input.onkeydown=function(event) {    input_keycode(event, this);
  };
  input.onblur=function() {    allow_hover=true;
    var ele=$id(this.getAttribute('ele_id'));
    if (this.getAttribute('is_cancel') == 0) {      var group_id=ele.parentNode.getAttribute('group_id');
      ele.firstChild.nodeValue=this.value;
      save_value('group_name', group_id, this.value);
      _groups[_groups_key[this.getAttribute('group_id')]][
        'group_name'
      ]=this.value;
      if ($id('group_name_next_to_bar_' + this.getAttribute('group_id'))) {        remove_child_nodes(
          $id('group_name_next_to_bar_' + this.getAttribute('group_id'))
        );
        $id(
          'group_name_next_to_bar_' + this.getAttribute('group_id')
        ).appendChild($text(this.value));
      }
      tgEvents.publish(tgEvents.GROUP_RENAMED, {        id: parseInt(group_id),
        name: this.value,
      });
      track_segment_event('gantt-renamed-a-group-from-name-column');
    }
    ele.className='category_name';
    if (ele.previousSibling) {      ele.previousSibling.className=ele.previousSibling.getAttribute(
        'temp_class'
      );
    }
    if (ele.previousSibling.previousSibling) {      ele.previousSibling.previousSibling.className=ele.previousSibling.previousSibling.getAttribute(
        'temp_class'
      );
    }
    highlight_row('category', this.getAttribute('group_id'), 'hover_off');
    if (this && this.parentNode && this.parentNode.parentNode) {      this.parentNode.parentNode.removeChild(this.parentNode);
    }
  };
  div.appendChild(input);
  ele.className='hidden';
  if (ele.previousSibling) {    ele.previousSibling.setAttribute(
      'temp_class',
      ele.previousSibling.className
    );
    ele.previousSibling.className='hidden';
  }
  if (ele.previousSibling.previousSibling) {    ele.previousSibling.previousSibling.setAttribute(
      'temp_class',
      ele.previousSibling.previousSibling.className
    );
    ele.previousSibling.previousSibling.className='hidden';
  }
  parent.appendChild(div);
  input.focus();
  input.select();
}
//HEADER RADIO
function manage_radio(ele) {  if (ele) {    if (ele.getAttribute('name') == 'filter_dates') {      var ele_is_selected =
        ele.className.indexOf('selected') > -1 && ele.id != 'filter_dates_other'
          ? true
          : false;
    }
    //UNCHECK ALL
    var items=document.body.getElementsByTagName('DIV');
    var il=items.length;
    for (i=0; i < il; i++) {      if (items[i].getAttribute('name') == ele.getAttribute('name')) {        items[i].className=items[i].className.replace(/selected_red/g, '');
        items[i].className=items[i].className.replace(/selected/g, '');
      }
    }
    if (ele.parentNode.parentNode.id == 'underbar') {      ele.className += ele_is_selected == false ? ' selected selected_red' : '';
    } else {      ele.className += ele_is_selected == false ? ' selected' : '';
    }
    //UPDATE DROP DOWN DEFAULT TEXT
    if (
      ele.getAttribute('name') == 'filter_dates' &&
      ele.id != 'filter_dates_other'
    ) {      select_date_filter(ele, 0);
    } else {      if ($id('date_filter') && $id('date_filter').value == '') {        $id('filter_dates_other').className=trim(
          $id('filter_dates_other').className.replace(/selected_red/g, '')
        );
      }
      if (ele.getAttribute('target_input_id') != '') {        if ($id(ele.getAttribute('target_input_id'))) {          $id(ele.getAttribute('target_input_id')).value=ele.getAttribute(
            'value'
          );
        }
      }
    }
  }}
//SET DATE FILTER
function select_date_filter(ele, do_refresh) {  do_refresh=do_refresh || 1;
  $id('filter_dates_other').firstChild.firstChild.nodeValue =
    ele.getAttribute('other') == 'true'
      ? get_date_filter_text(ele.firstChild.nodeValue)
      : 'All Dates';
  close_previous_dds();
  $id('date_filter').value =
    ele.className.indexOf('selected') > -1 ||
    ele.getAttribute('other') == 'true'
      ? ele.getAttribute('value').replace(/ /g, '')
      : '';
  //IF BLANK - SET TO ALL DATES
  if ($id('date_filter').value == '') {    $id('filter_dates_other').firstChild.firstChild.nodeValue='All Dates';
    manage_radio($id('filter_dates_other'));
    $id('filter_dates_other').className=trim(
      $id('filter_dates_other').className.replace(/selected_red/g, '')
    );
    $id('filter_dates_other').className=trim(
      $id('filter_dates_other').className.replace(/selected/g, '')
    );
    $id('filter_dates_other').className += ' selected';
    $id('filters_date_clear').className += ' hidden';
  } else {    $id('filter_dates_other').className += ' selected selected_red';
    $id('filters_date_clear').className=trim(
      $id('filters_date_clear').className.replace(/hidden/g, '')
    );
  }
  if (do_refresh == 1) {    load_gantt();
    track_segment_event('filter_applied');
    track_segment_event('gantt-applied-date-filter');
  }}
function get_date_filter_text(string) {  if (string == 'All Dates') {    return string;
  } else {    //return "Filtered ("+string+")";
    return string;
  }}
//SET COLOR FILTER
function select_color_filter(ele, do_refresh) {  do_refresh=do_refresh || 1;
  var value_input=$id('color_filter');
  var selected_colors=value_input.value.split(',');
  var this_color=ele.getAttribute('value');
  if (do_refresh == 1) {    if (js_in_array(this_color, selected_colors) == -1) {      value_input.value +=
        value_input.value == '' ? this_color : ',' + this_color;
    } else {      var temp_values=[];
      for (var i=0; i < selected_colors.length; i++) {        if (selected_colors[i] != this_color) {          temp_values.push(selected_colors[i]);
        }
      }
      value_input.value=temp_values.join(',');
    }
  }
  var parent=$id('filter_colors');
  value_input.value=trim(value_input.value);
  //PREP DROPDOWN HEADER
  parent.className=trim(parent.className.replace(/selected_red/g, ''));
  parent.className=trim(parent.className.replace(/selected/g, ''));
  var clear_filters=$id('filters_color_clear');
  //SHOW VALUES & STYLES
  if (value_input.value == '') {    parent.firstChild.firstChild.nodeValue='All Colors';
    parent.className += ' selected';
    clear_filters.className += ' hidden';
  } else if (value_input.value.split(',').length == 1) {    var sel_color='1 Color';
    var opts=$id('color_filters_dd_box').getElementsByTagName('INPUT');
    for (var o=0; o < opts.length; o++) {      if (opts[o].value == value_input.value) {        var sel_color=opts[o].parentNode.textContent;
      }
    }
    parent.firstChild.firstChild.nodeValue=sel_color;
    parent.className += ' selected selected_red';
    clear_filters.className=trim(
      clear_filters.className.replace(/hidden/g, '')
    );
  } else {    parent.firstChild.firstChild.nodeValue =
      value_input.value.split(',').length + ' Colors';
    parent.className += ' selected selected_red';
    clear_filters.className=trim(
      clear_filters.className.replace(/hidden/g, '')
    );
  }
  //REFRESH BECAUSE FILTER WAS APPLIED
  if (do_refresh == 1) {    load_gantt();
    track_segment_event('gantt-applied-color-filter');
  }}
function clear_color_filter() {  $id('color_filter').value='';
  var inputs=$id('color_filters_dd_box').getElementsByTagName('INPUT');
  for (var i=0; i < inputs.length; i++) {    inputs[i].checked=false;
    select_color_filter(inputs[i], 'NO');
  }
  load_gantt();
}
function manage_dropdown(parent, ele) {  //SHOW VALUE
  var show_value=ele.firstChild.nodeValue;
  parent.firstChild.firstChild.nodeValue=show_value;
  //UPDATE INPUT
  var input=$id(ele.getAttribute('target_input_id'));
  if (input) {    input.value=ele.getAttribute('value');
  }}
//HEADER SELECT RESOURCE FILTER
function select_resource_filter(ele) {  if (ele.id == 'filter_resources_my_tasks') {    var opt1=$id('user_resources_selected');
    var opt2=$id('company_resources_selected');
    var opt3=$id('custom_resources_selected');
    if (
      opt1.value == ele.getAttribute('value') &&
      opt2.value == '' &&
      opt3.value == ''
    ) {      //HOLD
    } else if (ele.className.indexOf('selected') == -1) {      //UNCHECK ALL RESOURCE OPTIONS
      var checkboxes=$id('filter_resources_dd_box').getElementsByTagName(
        'INPUT'
      );
      for (var c=0; c < checkboxes.length; c++) {        if (checkboxes[c].getAttribute('type') == 'checkbox') {          checkboxes[c].checked=false;
        }
      }
      //CLEAR FILTERS
      opt1.value='';
      opt2.value='';
      opt3.value='';
    }
    //CHECK MY NAME
    var my_ele=$id('resource_user_' + ele.getAttribute('value'));
    if (my_ele) {      my_ele.click();
    }
  }}
function open_sub_dd(ele, parent, target, direction) {  var top =
    target.offsetTop * 1 + parent.offsetTop * 1 - target.parentNode.scrollTop;
  var left=target.parentNode.offsetLeft * 1 + target.offsetWidth * 0.9;
  var page_height=page_sizes()[1] - 10;
  if (direction == 'open') {    target.className +=
      target.className.indexOf('selected') == -1 ? ' selected' : '';
    ele.setAttribute('parent', parent.id);
    ele.setAttribute('target', target.id);
    if(target.id === 'baselines_option'){      ele.style.minWidth='222px';
    }
    ele.className='box_option';
    ele.style.top=top + 'px';
    ele.style.left=left + 'px';
    ele.setAttribute('mouse_over', 0);
    ele.onmouseout=function() {      this.setAttribute('mouse_over', 0);
      var parent=$id(this.getAttribute('parent'));
      parent.setAttribute('mouse_over', 0);
      check_close(this, null);
      check_close(parent, null);
    };
    ele.onmouseover=function() {      this.setAttribute('mouse_over', 1);
      var parent=$id(this.getAttribute('parent'));
      parent.setAttribute('mouse_over', 1);
    };
    ele.style.maxHeight=Math.round((page_height * 75) / 100) + 'px';
    var overflow=top * 1 + ele.offsetHeight * 1 - page_height;
    if (overflow > 0) {      top -= overflow;
      //top += 30;
      ele.style.top=top + 'px';
    }
    if (ele.id == 'view_zoom_interior') {      ele.appendChild($id('zoom_picker'));
    }
  }
  if (ele.id === 'baseline_interior') {    track_segment_event('gantt-displayed-baseline-list-from-menu');
  }}
function pause_dd_auto_close(dd) {  if (!window.__checkClose) {    window.__checkClose=check_close;
  }
  check_close=function() {    return false;
  };
}
function resume_dd_auto_close(dd) {  check_close=window.__checkClose;
}
function clear_people_resource_filters(ele) {  $id('user_resources_selected').value='';
  $id('custom_resources_selected').value='';
  $id('company_resources_selected').value='';
  if (ele) {    ele.checked=false;
  }
  url_vars('set');
  load_gantt();
}
//PDF PROJECT PICKER
function print_pdf_select() {  close_previous_dds();
  var queryString='';
  queryString += 'projects=' + $id('project_ids').value;
  //PULL PUBLIC KEYS
  var public_keys='';
  var pids=$id('project_ids').value.split(',');
  for (var p=0; p < pids.length; p++) {    public_keys += p != 0 ? ',' : '';
    public_keys +=
      _projects[_projects_key[pids[p]]] &&
      _projects[_projects_key[pids[p]]]['public_key']
        ? encodeURIComponent(_projects[_projects_key[pids[p]]]['public_key'])
        : '';
  }
  queryString += '&public_keys=' + public_keys;
  queryString += '&user_resources=' + $id('user_resources_selected').value;
  queryString +=
    '&company_resources=' + $id('company_resources_selected').value;
  queryString += '&project_resources=' + $id('custom_resources_selected').value;
  queryString += '&hide_completed=' + ($id('hide_completed').checked ? 1 : 0);
  queryString += '&user_date=' + today_date();
  queryString += '&date_filter=' + $id('date_filter').value;
  queryString += '&color_filter=' + $id('color_filter').value;
  queryString += '&baselines=' + $id('selected_baselines').value;
  window.open(NEW_APP_URL + 'projects/export/pdf?' + queryString);
  track_segment_event('gantt-opened-pdf-gantt-settings-window');
}
//PDF PROJECT PICKER
function print_pdf_notes_select() {  close_previous_dds();
  var queryString='';
  queryString += 'projects=' + $id('project_ids').value;
  queryString += '&user_resources=' + $id('user_resources_selected').value;
  queryString +=
    '&company_resources=' + $id('company_resources_selected').value;
  queryString += '&project_resources=' + $id('custom_resources_selected').value;
  queryString += '&hide_completed=' + ($id('hide_completed').checked ? 1 : 0);
  queryString += '&user_date=' + today_date();
  queryString += '&date_filter=' + $id('date_filter').value;
  queryString += '&color_filter=' + $id('color_filter').value;
  window.open(NEW_APP_URL + 'projects/export/notes?' + queryString);
  track_segment_event('gantt-opened-pdf-notes-settings-window');
}
//CSV EXPORT
function export_csv_select(project_ids) {  close_previous_dds();
  /*var queryString="";
queryString += "projects="+$id("project_ids").value;
queryString += "&user_resources="+$id("user_resources_selected").value;
queryString += "&company_resources="+$id("company_resources_selected").value;
queryString += "&project_resources="+$id("custom_resources_selected").value;
queryString += "&hide_completed="+( ($id("hide_completed").checked) ? 1 : 0);
queryString += "&user_date="+today_date();
queryString += "&date_filter="+$id("date_filter").value;
window.open("../export/csv/?"+queryString);
*/
  project_ids=project_ids || $id('project_ids').value;
  var csv_url=API_URL + 'v1/projects/export/csv?ids=' + project_ids;
  new $ajax({    type: 'POST',
    url: csv_url,
    data: {},
    response: function(data) {      var json=json_decode(data.responseText);
      var alink=$create('A');
      alink.id='custom_alert_yes';
      alink.className='okay';
      alink.setAttribute('href', json.download_url);
      alink.setAttribute('target', '_blank');
      alink.innerHTML='Yes';
      alink.style.textDecoration='none';
      alink.onclick=function() {        $id('custom_alert_no').click();
      };
      var conf=custom_confirm(
        'Your CSV was successfully saved. Would you like to download it?'
      );
      conf['yes'].parentNode.appendChild(alink);
      conf['yes'].parentNode.removeChild(conf['yes']);
    },
  });
}
//CSV FEED
function subscribe_csv_feed(auth) {  close_previous_dds();
  var queryString='?';
  queryString += 'projects=' + $id('project_ids').value;
  queryString += '&user_resources=' + $id('user_resources_selected').value;
  queryString +=
    '&company_resources=' + $id('company_resources_selected').value;
  queryString += '&project_resources=' + $id('custom_resources_selected').value;
  queryString += '&hide_completed=' + ($id('hide_completed').checked ? 1 : 0);
  queryString += '&date_filter=' + $id('date_filter').value;
  queryString += '&auth=' + tweak_text_for_get(auth);
  var string =
    'https://prod.teamgantt.com/' +
    $id('js_gantt_url').value +
    '/export/csv/csv-display.php' +
    queryString;
  var html='<div><b>CSV Feed:</b></div>';
  html +=
    "<div style='padding-top:1em; padding-bottom:1em;'>Just like our CSV export, this is a feed ";
  html +=
    'that can be used to sync project data with applications (such as google sheets) that allow CSV feeds. ';
  html +=
    'Based off of the filters you have applied, below is the link to your CSV feed.</div>';
  html +=
    "<textarea style='width:99%; height:5em; font-size:1em;'>" +
    string +
    '</textarea>';
  var conf=custom_alert(html);
  conf.parentNode.style.marginTop='-90px';
}
//CALENDAR FEED
function subscribe_calendar_feed() {  close_previous_dds();
  var project_ids=($id('project_ids').value != '') ? $id('project_ids').value.split(',') : [];
  queryString='?';
  queryString += 'projectId=' + project_ids[0];
  navigate_window(NEW_APP_URL + 'calendar/feed' + queryString);
}
/**
 * Change the zoom (optionally save), reloading the Gantt after changing
 *
 * @param {Element} ele
 * @param {Boolean} save
 */
function change_zoom(ele, save) {  var zoom_value=ele.getAttribute('zoom');
  select_zoom(zoom_value);
  if (save == true) {    update_preference({zoom: zoom_value});
    save_value(
      'project_zoom',
      _projects[0]['project_id'],
      zoom_value
    );
  }
  // refresh view regardless of saving or not
  setTimeout(function() {    load_gantt();
  }, 250);
}
/**
 * Sets the value of the zoom picker and zoom setting.
 *
 * @param {string} zoom
 */
function select_zoom(zoom) {  $id('zoom').value=zoom;
  var opts=$id('zoom_picker').getElementsByTagName('DIV');
  for (var i=0; i < opts.length; i++) {    if (
      opts[i].getAttribute('zoom') != null &&
      opts[i].getAttribute('zoom') != undefined
    ) {      opts[i].className =
        opts[i].getAttribute('zoom') == zoom
          ? 'option option2 option_small selected'
          : 'option option2 option_small';
    }
  }}
//SET FONT SIZE
function set_font_size(ele, save) {  var size=12;
  if (typeof ele == 'string') {    size=ele;
  } else if (ele.tagName.toUpperCase() != 'SELECT') {    size=ele.getAttribute('size');
  } else {    size=ele.value;
  }
  if (_version == 'gantt_chart') {    var gc=$id('gantt_chart');
    gc.style.fontSize=size + 'px';
    if (gc.className == '') {      gc.className='font' + size;
    } else {      for (var i=9; i <= 16; i++) {        gc.className=trim(gc.className.replace('font' + i, ''));
      }
      gc.className += ' font' + size;
      gc.className=trim(gc.className);
    }
    adjust_left_panel_width(_left_width * 1 + 1);
    if (save == true) {      //UPDATE LIST
      load_critical_paths();
      set_scroll_bar();
      set_scroll_bar();
      set_scroll_bar();
      update_preference({gantt_font: size});
    }
    display_resource_view('nosave');
    check_scroll();
    if ($id('resource_view')) {      $id('resource_view').style.fontSize=size + 'px';
    }
    if ($id('resource_view_list')) {      $id('resource_view_list').style.fontSize=size + 'px';
    }
    hide_show_columns();
  } else if (_version == 'list_view') {    $id('list_view').style.fontSize=size + 'px';
    update_preference({gantt_font: size});
  } else if (_version == 'resource_view') {    $id('font_size').value=size;
    update_preference({resource_view_font_size: size});
    setTimeout(function() {      reset_resource_view();
    }, 250);
  }
  _font_size=size;
  select_font_size(size);
}
function select_font_size(size) {  //HIGHLIGHT DROP DOWN DIV
  if ($id('view_font_interior')) {    var divs=$id('view_font_interior').getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      divs[d].className=trim(divs[d].className.replace(/selected/g, ''));
      if (divs[d].getAttribute('size') == size) {        divs[d].className += ' selected';
      }
    }
    if ($id('font_size')) {      $id('font_size').value=size;
    }
    $id('selected_font_size').firstChild.nodeValue='(' + size + ')';
  }}
function enable_hours_popup() {  new $ajax({    type: 'GET',
    url:
      '/' +
      $id('js_gantt_url').value +
      '/schedule/json.check_hours.php?project_ids=' +
      $id('project_ids').value,
    response: function(data) {      var response=json_decode(data.response);
      var upgrade_alert_on=[];
      var show_column_on=[];
      //LOOP THROUGH
      for (var i in response) {        if (response[i].allowed == false) {          upgrade_alert_on.push({            company_id: response[i].company_id,
            permissions: response[i].permissions,
          });
        }
      }
      //IF THEY NEED TO UPGRADE TO SHOW COLUMN
      if (upgrade_alert_on.length > 0) {        var html="<div class='popup_title'>";
        html += '<b>Enabling Hourly Estimating</b>';
        html += '</div>';
        if (upgrade_alert_on[0].permissions == 'admin') {          html +=
            "<p style='margin-top:-50px;'>You can upgrade to the advanced plan to gain this additional functionality:</p>";
          html += '<ul>';
          html +=
            '<li><b>Hourly Estimating:</b> Estimate the number of hours each person is working on each task.</li>';
          html +=
            '<li><b>More Detailed Workloads:</b> See how many hours per day everyone is scheduled for.</li>';
          html +=
            '<li><b>Time Tracking:</b> Simple time tracking for your team.</li>';
          html +=
            '<li><b>Actual vs Estimated Hours:</b> Get realtime visuals in the gantt chart of your hourly budgets.</li>';
          html +=
            '<li><b>Reports:</b> Simple but powerful reports about hours worked on tasks and projects.</li>';
          html += '</ul>';
          html += "<p><b>Learn more about what's included!</b></p>";
          html += '<div>';
          html += "<div class='alert_video'>";
          html +=
            '<a href="http://support.teamgantt.com/article/79-hourly-estimation" target="_blank">';
          html +=
            '<img src="https://embed-ssl.wistia.com/deliveries/5b0b5d8bda86c326b212c06c6aed380216520aa0.jpg?image_play_button=true&image_play_button_color=62bdd5e0&image_crop_resized=100x56" alt="Hourly Estimating in TeamGantt" width="100" height="56" />';
          html += '</a>';
          html += 'Hourly Estimating and Resourcing';
          html += '<span>3:35</span>';
          html += '</div>';
          html += "<div class='alert_video'>";
          html +=
            '<a href="https://teamgantt.wistia.com/medias/5g9y3e2bou" style="margin-left:1em;">';
          html +=
            '<img src="https://embed-ssl.wistia.com/deliveries/f9d1eaf950ac4e8d93ec5d608777f71df9232b62.jpg?image_play_button=true&image_play_button_color=62bdd5e0&image_crop_resized=100x56" alt="How to Use Time Tracking in TeamGantt" width="100" height="56" />';
          html += '</a>';
          html += 'Time Tracking';
          html += '<span>3:05</span>';
          html += '</div>';
          html += '</div>';
          html += "<div class='clear'></div>";
          var conf=custom_confirm(html);
          conf['yes'].firstChild.nodeValue='Next';
          conf['yes'].onclick=function() {            navigate_window(
              NEW_APP_URL +
              'admin/companies/' +
              upgrade_alert_on[0].company_id +
              '/subscription');
          };
          conf['no'].firstChild.nodeValue='Cancel';
        } else {          html +=
            "<p style='margin-top:-50px;'>Contact an account holder to enable hourly estimating and time tracking.</p>";
          html += '<ul>';
          html +=
            '<li><b>Hourly Estimating:</b> Estimate the number of hours each person is working on each task.</li>';
          html +=
            '<li><b>More Detailed Workloads:</b> See how many hours per day everyone is scheduled for.</li>';
          html +=
            '<li><b>Time Tracking:</b> Simple time tracking for your team.</li>';
          html +=
            '<li><b>Actual vs Estimated Hours:</b> Get realtime visuals in the gantt chart of your hourly budgets.</li>';
          html +=
            '<li><b>Reports:</b> Simple but powerful reports about hours worked on tasks and projects.</li>';
          html += '</ul>';
          html += "<p><b>Learn more about what's included!</b></p>";
          html += '<div>';
          html += "<div class='alert_video'>";
          html +=
            '<a href="http://support.teamgantt.com/article/79-hourly-estimation" target="_blank">';
          html +=
            '<img src="https://embed-ssl.wistia.com/deliveries/5b0b5d8bda86c326b212c06c6aed380216520aa0.jpg?image_play_button=true&image_play_button_color=62bdd5e0&image_crop_resized=100x56" alt="Hourly Estimating in TeamGantt" width="100" height="56" />';
          html += '</a>';
          html += 'Hourly Estimating and Resourcing';
          html += '<span>3:35</span>';
          html += '</div>';
          html += "<div class='alert_video'>";
          html +=
            '<a href="https://teamgantt.wistia.com/medias/5g9y3e2bou" style="margin-left:1em;">';
          html +=
            '<img src="https://embed-ssl.wistia.com/deliveries/f9d1eaf950ac4e8d93ec5d608777f71df9232b62.jpg?image_play_button=true&image_play_button_color=62bdd5e0&image_crop_resized=100x56" alt="How to Use Time Tracking in TeamGantt" width="100" height="56" />';
          html += '</a>';
          html += 'Time Tracking';
          html += '<span>3:05</span>';
          html += '</div>';
          html += '</div>';
          html += "<div class='clear'></div>";
          custom_alert(html);
        }
      } else {        //SEE IF WE NEED TO ENABLE HOURS ON ANY OF THE PROJECTS
        var enable_alert_allowed=[];
        var enable_alert_need_permission=[];
        for (p in _projects) {          if (_projects[p]['project_enable_hours'] == 0) {            if (_projects[p]['project_permission'] == 'admin') {              enable_alert_allowed.push({                project_id: _projects[p]['project_id'],
                permission: _projects[p]['project_permission'],
              });
            } else {              enable_alert_need_permission.push({                project_id: _projects[p]['project_id'],
                permission: _projects[p]['project_permission'],
              });
            }
          }
        }
        //IF WE NEED TO ALERT THE USER BECAUSE OF HOURLY BEING TURNED OFF ON PROJECTS
        if (
          enable_alert_allowed.length > 0 ||
          enable_alert_need_permission.length > 0
        ) {          var html =
            "<div class='popup_title'>Enabling Hourly Estimating</div>";
          //SHOW ALERT MESSAGE FOR PROJECTS THAT CAN BE ENABLED
          if (enable_alert_allowed.length == 1) {            html += '<p>Hourly estimating is currently turned off on "';
            html +=
              _projects[_projects_key[enable_alert_allowed[0].project_id]][
                'project_name'
              ] + '". ';
            html += 'Would you like to enable it on this project? </p>';
          } else if (enable_alert_allowed.length > 0) {            html +=
              '<p>The following projects currenty have hourly estimating turned off. ';
            html += 'Would you like to enable it on them?</p>';
            for (var i in enable_alert_allowed) {              html +=
                '<div> - ' +
                _projects[_projects_key[enable_alert_allowed[i].project_id]][
                  'project_name'
                ] +
                '</div>';
            }
          }
          if (
            enable_alert_allowed.length > 0 &&
            enable_alert_need_permission.length > 0
          ) {            html += '<br />';
          }
          //ALERT MESSAGE FOR PROJECTS THAT PROJECT ADMIN NEEDS TO UPDATE
          if (enable_alert_need_permission.length == 1) {            html +=
              "<p class='disabled'>You do no thave the sufficient privilages to enable hourly estimating on \"";
            html +=
              _projects[
                _projects_key[enable_alert_need_permission[0].project_id]
              ]['project_name'] + '". ';
            html +=
              'Please contact a project admin to enable for this project. </p>';
          } else if (enable_alert_need_permission.length > 0) {            html +=
              "<p class='disabled'>The following projects currently have hourly estimating turned off. ";
            html +=
              'However, you do not have sufficient privilages to enable it on them. ';
            html += 'Please contact a project admin to enable it.</p>';
            for (var i in enable_alert_need_permission) {              html +=
                "<div class='disabled'>- " +
                _projects[
                  _projects_key[enable_alert_need_permission[i].project_id]
                ]['project_name'] +
                '</div>';
            }
          }
          //BUILD THE CONFIRMATION WINDOW
          var conf=custom_confirm(html);
          if (enable_alert_allowed.length > 0) {            var project_count=0;
            //IF THEY HAVE PERMISSION TO TURN IT ON
            conf['yes'].firstChild.nodeValue='Yes, Enable Hourly Estimating';
            conf['yes'].onclick=function() {              for (var e in enable_alert_allowed) {                project_count++;
                // refresh after last project is updated
                if (project_count === enable_alert_allowed.length) {                  var callback=function() {                    load_gantt();
                  };
                } else {                  var callback=function() { };
                }
                update_target('project', enable_alert_allowed[e].project_id, {                  has_hours_enabled: true
                }, callback);
              }
              $id('tab_selector_options').className='hidden';
              this.ondblclick();
            };
          } else {            //IF THEY ARE NOT A PROJECT ADMIN ON ANY OF THE PROJECTS
            conf['yes'].firstChild.nodeValue='Ok';
            conf['yes'].onclick=function() {              this.ondblclick();
              $id('tab_selector_options').className='hidden';
            };
            conf['no'].style.display='none';
          }
          conf['no'].firstChild.nodeValue='No thanks.';
          conf['no'].onclick=function() {            this.ondblclick();
            $id('tab_selector_options').className='hidden';
          };
        }
      }
      //SHOW COLUMN
      $id('show_estimated_hours_column').checked=true;
      $id('show_estimated_hours_column_control').className += ' checked';
    },
  });
  track_segment_event('gantt-viewed-enable-hours-overlay');
}
// JavaScript Document
var ignore_scroll=false;
var _set_arrows=null;
var _default_match='tasks';
var _scroll_warning=false;
function match_scrolls() {  if (ignore_scroll == false) {    if ($id('task_header')) {      if ($id('tasks').scrollLeft < 4) {        $id('tasks').scrollLeft=4;
      }
      var target_scroll_left=$id('tasks').scrollLeft;
      if (_default_match == 'resource_view' && $id('resource_view')) {        target_scroll_left=$id('resource_view').scrollLeft;
        $id('tasks').scrollLeft=target_scroll_left;
      }
      $id('task_header').scrollLeft=target_scroll_left;
      $id('spacer').style.marginLeft=$id('task_header').scrollLeft * 1 + 'px';
      $id('tasks').scrollTop=0;
      var scroll_left=target_scroll_left;
      var pixel_scroll=$id('scroll_bar').getAttribute('pixel_scroll');
      $id('scroll_bar').style.marginLeft=scroll_left / pixel_scroll + 'px';
      //RESOURCE VIEW
      if ($id('resource_view') && _default_match != 'resource_view') {        //MATCH SCROLL
        $id('resource_view').scrollLeft=$id('tasks').scrollLeft;
      }
      //MAKE STUFF THE RIGHT WIDTH
      if ($id('resource_view')) {        var divs=$id('resource_view').getElementsByTagName('DIV');
        var full_width=$id('tasks').scrollWidth;
        for (var d=0; d < divs.length; d++) {          if (divs[d].className.indexOf('resource_bar_parent') > -1) {            divs[d].style.width=full_width + 'px';
          }
        }
        if ($id('resource_resizer')) {          $id('resource_resizer').style.width=full_width + 'px';
        }
      }
      //SCROLLED ALL THE WAY LEFT - CHANGE START DATE MESSAGE
      if (
        scroll_left < 5 &&
        _scroll_warning == true &&
        !$id('custom_alert_cover')
      ) {        //PERMISSIONS OF PROJECTS
        var any_admin=[];
        for (var i=0; i < _projects.length; i++) {          if (_projects[i]['project_permission'] == 'admin') {            var any_admin_length=any_admin.length;
            any_admin[any_admin_length]=i;
          }
        }
        if (
          _version == 'gantt_chart' &&
          $id('start_date_alert') == undefined &&
          _close_start_date_alert == false &&
          _projects[0]['cal_start_date'] == ''
        ) {          var page_height=page_sizes();
          var alrt=$create('DIV');
          alrt.id='start_date_alert';
          alrt.style.top =
            $id('background_lines').offsetTop * 1 + page_height[1] * 0.5 + 'px';
          var inner_html =
            '<div>Want to make the start date of your project earlier?</div>';
          inner_html +=
            "<div><span onclick=\"$id('tasks').removeChild($id('start_date_alert'));\">No thanks</span>";
          inner_html +=
            "<span class='orange_button button_small'>Sure</span></div>";
          var div=$create('DIV');
          div.appendChild(
            $text('Want to make the start date of your project earlier?')
          );
          alrt.appendChild(div);
          var div=$create('DIV');
          div.style.marginTop='0.75em';
          var span1=$create('SPAN');
          span1.onclick=function() {            $id('tasks').removeChild($id('start_date_alert'));
            _close_start_date_alert=true;
          };
          span1.appendChild($text('No thanks'));
          span1.style.marginRight='1em';
          div.appendChild(span1);
          var span2=$create('DIV');
          span2.className='white_button button_small';
          span2.appendChild($text('Yes'));
          div.appendChild(span2);
          if (any_admin.length == 1) {            span2.onclick=function() {              edit_project_info(_projects[any_admin[0]]['project_id']);
              $id('project_cal_start_date').focus();
              _close_start_date_alert=true;
            };
          } else if (any_admin.length > 1) {            span2.onclick=function() {              _close_start_date_alert=true;
              var html =
                '<div><b>You have multiple projects open, please select a project:</b></div>';
              html += '<ul>';
              for (var i=0; i < _projects.length; i++) {                if (_projects[i]['project_permission'] == 'admin') {                  html +=
                    "<li><span class='link' onclick=\"edit_project_info('" +
                    _projects[i]['project_id'] +
                    "'); $id('project_cal_start_date').focus(); $id('custom_alert_yes').click();\">";
                  html += _projects[i]['project_name'] + '</span></li>';
                }
              }
              html += '</ul>';
              var conf=custom_confirm(html);
              conf['no'].className='hidden';
              conf['yes'].firstChild.nodeValue='Cancel';
              conf['yes'].onclick=function() {                this.ondblclick();
                _close_start_date_alert=true;
              };
            };
          }
          alrt.appendChild(div);
          $id('tasks').appendChild(alrt);
        }
      } else if (scroll_left > 10 && $id('start_date_alert')) {        var e=$id('start_date_alert');
        if (e) {          e.parentNode.removeChild(e);
        }
      }
    }
    var tasks=$id('tasks');
    var task_box=$id('task_box');
    var scroll_left=tasks.scrollLeft * 1 + tasks.offsetWidth * 1;
    var scroll_width=task_box.offsetWidth * 1;
    if (
      scroll_left / scroll_width > 0.95 &&
      $id('scroll_bar').className.indexOf('no_transition') == -1
    ) {      var months_to_add=2;
      for (var i=0; i < months_to_add; i++) {        add_month();
      }
    }
    clearTimeout(_set_arrows);
    _set_arrows=setTimeout(set_arrows, 200);
    set_resource_view_scroll();
  }}
function ignore_scroll_timeout(which) {  _default_match='tasks';
  match_scrolls();
  if (which == 'ignore') {    _ignore_scroll=true;
    setTimeout(function() {      _ignore_scroll=false;
      _default_match='tasks';
      match_scrolls();
    }, 100);
  } else {    _ignore_scroll=false;
    setTimeout(function() {      _ignore_scroll=true;
      _default_match='tasks';
      match_scrolls();
    }, 1);
  }}
function set_resource_view_scroll() {  var tasks=$id('tasks');
  if (!tasks) {    return;
  }
  var scroll_left=tasks.scrollLeft * 1 + tasks.offsetWidth * 1;
  var sidebar_left=sidebar_width();
  if (_version == 'gantt_chart' && $id('resource_view')) {    var s_top=$id('resource_view').scrollTop;
    $id('resource_view_list').scrollTop=s_top;
    //$id("resource_view_list").style.minHeight=$id("resource_view").offsetHeight +"px";'
    //FIX IF THEY HEIGHTS ARE NOT PERFECTLY MATCHED
    if ($id('resource_view').scrollTop > $id('resource_view_list').scrollTop) {      $id('resource_view').scrollTop=$id('resource_view_list').scrollTop;
    }
    if ($id('resource_view_tab_bar__resizer')) {      var rview=$id('resource_view');
      var s_up=$id('resource_view_scroll_up');
      var s_down=$id('resource_view_scroll_down');
      if (rview && s_up && s_down) {        if (rview.scrollHeight > rview.offsetHeight) {          s_up.className='';
          s_down.className='';
          s_up.style.left=scroll_left + 'px';
          s_down.style.left=scroll_left + 'px';
          s_up.style.marginTop=s_top * 1 + 'px';
          s_down.style.marginTop=s_top * 1 - 8 + 'px';
        } else {          s_up.className='hidden';
          s_down.className='hidden';
        }
      }
    }
  }
  if (
    $id('resource_view') &&
    $id('resource_view').className != 'resource_collapsed'
  ) {    if ($id('resource_header_wrapper')) {      var rhw=$id('resource_header_wrapper');
      rhw.style.left=tasks.scrollLeft + 'px';
    }
  }
  if ($id('resource_view_tool_tip')) {    check_scroll();
  }}
function set_arrows() {  _set_arrows=null;
  var extra_left=0;
  var extra_right=-25; //width of div (check css for actual width)
  var box=$id('tasks').scrollLeft * 1;
  var full_box=box * 1 + $id('tasks').offsetWidth;
  var left_pos=box * 1 + extra_left;
  var right_pos=full_box * 1 + extra_right;
  //LOOP THROUGH TASKS
  for (var i=0; i < _tasks.length; i++) {    var bar=$id('task_div_' + _tasks[i]['task_id']);
    var left_arrow=$id('left_arrow_task_' + _tasks[i]['task_id']);
    var right_arrow=$id('right_arrow_task_' + _tasks[i]['task_id']);
    if (bar && left_arrow && right_arrow) {      //LEFT ARROW
      var left=bar.getAttribute('var_left');
      var right=left * 1 + bar.getAttribute('var_width') * 1;
      if (right * 1 < box * 1 && bar.getAttribute('var_left') > 0) {        left_arrow.className='left_arrow';
        left_arrow.style.marginLeft=left_pos + 'px';
      } else {        left_arrow.className='hidden';
      }
      //RIGHT ARROW
      var right=left * 1 + bar.getAttribute('var_width') * 1;
      if (left * 1 > full_box && bar.getAttribute('var_left') > 0) {        right_arrow.className='right_arrow';
        right_arrow.style.marginLeft=right_pos + 'px';
      } else {        right_arrow.className='hidden';
      }
    }
  }}
window.onscroll=check_scroll;
var _header_height=null;
var scroll_values=[];
function check_scroll() {  //GET PAGE VARIABLES
  var scroll_top=0;
  scroll_top=get_scrolltop();
  var page_height=page_sizes()[1];
  if (typeof scroll_values['header'] == 'undefined') {    //ELEMENTS
    scroll_values['header']=$id('header');
    scroll_values['gantt_location']=$id('gantt_location');
    scroll_values['task_header']=$id('task_header');
    scroll_values['send_message']=$id('feedback_box');
    scroll_values['cover_bar']=$id('scroll_bar_cover');
    scroll_values['scroll_bar']=$id('scroll_container');
    //UNCHANGING VALUES
    scroll_values['header_height']=$id('header').offsetHeight * 1;
    if (false && $id('header_tabs')) {      scroll_values['header_height'] += $id('header_tabs').offsetHeight * 1;
    }
    scroll_values['under_height']=$id('underbar').offsetHeight * 1;
  }
  scroll_values['bg_lines']=$id('background_lines'); //REDEFINE THIS EACH TIME
  if (scroll_values['bg_lines']) {    var extra_top=scroll_values['header_height'] - 20 + 14;
    extra_top=extra_top == 0 ? 7 : extra_top - 3;
    var from_top=scroll_values['under_height'] + extra_top;
    scroll_values['bg_lines'].style.top=scroll_top * 1 + from_top + 'px';
  }
  /* SCROLL BAR */
  if (scroll_values['cover_bar'] && scroll_values['scroll_bar']) {    var chart_bottom =
      scroll_values['cover_bar'].offsetTop -
      scroll_values['scroll_bar'].offsetHeight;
    var page_bottom =
      scroll_top * 1 + page_height - scroll_values['scroll_bar'].offsetHeight;
    var footer=$id('footer');
    var additional_bottom=footer ? footer.offsetHeight : 0;
    if ($id('gantt_help_videos')) {      additional_bottom += $id('gantt_help_videos').offsetHeight;
    }
    var scrollbar_from_top =
      chart_bottom < page_bottom ? chart_bottom : page_bottom;
    var resource_view_top=null;
    if (scrollbar_from_top != 0) {      scroll_values['scroll_bar'].setAttribute('from_top', scrollbar_from_top);
      scroll_values['scroll_bar'].style.position='fixed';
      scroll_values['scroll_bar'].style.top='';
      scroll_values['scroll_bar'].style.bottom=additional_bottom + 'px';
    } else {      if (scroll_values['scroll_bar'] && $id('tasks')) {        scroll_values['scroll_bar'].style.top =
          $id('tasks').offsetHeight - 6 + 'px';
      }
    }
    //RESOURCE DAY DETAILS
    if (
      $id('resource_view_day_details') &&
      $id('resource_view_day_details').className == ''
    ) {      place_resource_details(
        $id('resource_view_day_details'),
        $id($id('resource_view_day_details').getAttribute('ele'))
      );
    }
    //RESOURCE VIEW TIP
    const tip=$id('resource_view_tool_tip');
    const resource_view=$id('resource_view');
    const resizer=$id('resource_view_tab_bar__resizer');
    if (tip && resource_view && resizer) {      tip.style.bottom =
        (
          resource_view.offsetHeight * 1
          + tip.offsetHeight * 1
        )
        + 'px';
      tip.style.paddingBottom=resizer.offsetHeight + 'px';
    }
  }}
function get_scrolltop() {  var scrOfX=0,
    scrOfY=0;
  if (typeof window.pageYOffset == 'number') {    //Netscape compliant
    scrOfY=window.pageYOffset;
  } else if (
    document.body &&
    (document.body.scrollLeft || document.body.scrollTop)
  ) {    //DOM compliant
    scrOfY=document.body.scrollTop;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollLeft || document.documentElement.scrollTop)
  ) {    //IE6 standards compliant mode
    scrOfY=document.documentElement.scrollTop;
  }
  return scrOfY;
}
function get_scrollleft() {  var scrOfX=0;
  if (typeof window.pageYOffset == 'number') {    //Netscape compliant
    scrOfX=window.pageXOffset;
  } else if (
    document.body &&
    (document.body.scrollLeft || document.body.scrollTop)
  ) {    //DOM compliant
    scrOfX=document.body.scrollLeft;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollLeft || document.documentElement.scrollTop)
  ) {    //IE6 standards compliant mode
    scrOfX=document.documentElement.scrollLeft;
  }
  return scrOfX;
}
function move_scroll(which_way) {  var tgt=$id('tasks');
  var sLeft=tgt.scrollLeft;
  var move_distance=100;
  if (which_way == 'negative') {    tgt.scrollLeft=sLeft - move_distance;
  } else {    tgt.scrollLeft=sLeft * 1 + move_distance * 1;
  }
  remove_selection();
  set_scroll_bar();
}
function set_scroll_bar() {  var spacer=$id('spacer');
  var extra_padding=3;
  $id('scroll_bar_cover').className='';
  var t=$id('tasks');
  var tb=$id('task_box');
  var sc=$id('scroll_container');
  var sb=$id('scroll_bar');
  if (t && tb && $id('spacer').previousSibling) {    var display_width=t.offsetWidth - extra_padding * 2 - 50;
    var full_width =
      tb.offsetWidth - $id('spacer').previousSibling.getAttribute('var_width'); //funky last month display - just pull it back.
    var scroll_left=t.scrollLeft;
    if (iOS == 0) {      if ($id('trial_warning')) {        $id('trial_warning').style.width =
          spacer.offsetWidth - get_scrollleft() + 2 + 'px';
      }
      if (display_width < full_width) {        var ratio=display_width / full_width;
        var left=spacer.offsetWidth - get_scrollleft() + extra_padding - 1;
        left += sidebar_width();
        sc.style.left=left + 'px';
        sc.style.right=20 + 'px';
        var scroll_width=Math.floor(display_width * ratio);
        sb.style.width=scroll_width + 'px';
        var px_scroll=(display_width / scroll_width).toFixed(1);
        sb.setAttribute('pixel_scroll', px_scroll);
        var scroll_left=Math.floor(t.scrollLeft / px_scroll);
        sb.style.marginLeft=scroll_left + 'px';
        sb.setAttribute('subtract_left', 0);
        sb.onmousedown=function() {          start_move('scroll');
        };
        sc.className='';
        disableSelection(sc);
      } else {        sc.className='hidden';
      }
    } else {      sc.className='hidden';
    }
  } else {    setTimeout(set_scroll_bar, 200);
  }}
function scroll_control() {  var t=$id('tasks');
  var tb=$id('task_box');
  var sc=$id('scroll_container');
  var sb=$id('scroll_bar');
  var subtract_left=sb.getAttribute('subtract_left') * 1;
  var mx=mouseX - _start_mouseX;
  var move_left=mx * 1 + subtract_left;
  if (move_left < 0) {    move_left=0;
  } else if (move_left > sc.offsetWidth - sb.offsetWidth - 2) {    move_left=sc.offsetWidth - sb.offsetWidth - 2;
  }
  sb.style.marginLeft=move_left + 'px';
  t.scrollLeft=move_left * sb.getAttribute('pixel_scroll');
  t.setAttribute('scroll_left', move_left * sb.getAttribute('pixel_scroll'));
}
function focus_today(focus_date, focus_base, die) {  focus_date=focus_date || null;
  focus_base=focus_base || 'center';
  die=die || null;
  //TODAY
  var dt=new Date();
  var year=dt.getFullYear();
  var month=dt.getMonth() * 1 + 1;
  month=month < 10 ? '0' + month : month;
  var day=dt.getDate();
  day=day < 10 ? '0' + day : day;
  var today_date=year + '-' + month + '-' + day;
  var today_id='line_' + year + '' + month + '' + day;
  if (focus_date == null) {    //DATE POSITIONS
    var start_date=null;
    var end_date=null;
    //FIND PROJECT START AND END SPOTS
    for (var i=0; i < _projects.length; i++) {      start_date =
        (_projects[i]['project_start'] < start_date || start_date == null) &&
        _projects[i]['project_start'] != ''
          ? _projects[i]['project_start']
          : start_date;
      end_date =
        (_projects[i]['project_end'] > end_date || end_date == null) &&
        _projects[i]['project_end'] != ''
          ? _projects[i]['project_end']
          : end_date;
    }
    start_date=start_date != null ? start_date.replace(/-/g, '') : null;
    end_date=end_date != null ? end_date.replace(/-/g, '') : null;
    var today_ele=$id(today_id);
    today=today_ele != null ? today_ele.getAttribute('var_left') * 1 : 0;
    var start_ele=$id('line_' + start_date);
    start=start_ele != null ? start_ele.getAttribute('var_left') * 1 : 0;
    var end_ele=$id('line_' + end_date);
    end=end_ele != null ? end_ele.getAttribute('var_left') * 1 : 0;
    //POSITION VARIABLES
    if ($id('tasks')) {      if (
        (start_date == null && end_date == null) ||
        (start_date == '' && end_date == '')
      ) {        focus_today(today_date, 'left', true);
      } else if (today <= start && start != 0) {        focus_today(start_date, 'left', true);
      } else if (today > end && end != 0) {        focus_today(end_date, 'center', true);
      } else {        focus_today(today_date, 'left_center', true);
      }
      /*
//FIND WHAT TO FOCUS
if(start_date == null && end_date == null) {focus_today(today_date, "left", die);
}
else if(start_date == "" && end_date == "") {focus_today(today_date, "left", die);
}
else if(z < task_width || x <= 0) {if(y >= 0) {focus_today(end_date, "center", die);
}
else {focus_today(start_date, "left", die);
}}
else if(x < task_half && x > 0) {focus_today(start_date, "left", die);
}
else if(today > end) {focus_today(end_date, "center", die);
}
else if(x > task_half) {focus_today(today_date, "left_center", die);
}
else {focus_today(today_date, "center", die);
}
*/
    }
  } else {    var id='line_' + focus_date.replace(/-/g, '');
    if ($id(id)) {      var from_left=$id(id).offsetLeft;
      var full_width=$id('tasks').offsetWidth;
      if (focus_base == 'left') {        var padding_left=find_day_width() * 7;
      } else if (focus_base == 'left_center') {        var padding_left=Math.ceil((full_width / 4) * 1);
      } else {        var padding_left=Math.ceil((full_width / 2) * 1);
      }
      var left=from_left - padding_left;
      $id('tasks').scrollLeft=left;
    } else if (die == null) {      var focus_dt=today_id.replace('line_', '');
      focus_today(focus_dt, 'center', true);
    }
  }}
function find_middle_date() {  //find middle date
  var left=$id('tasks').scrollLeft;
  var width=$id('tasks').offsetWidth * 0.5;
  var day_width=_day_width[$id('zoom').value];
  return find_date(left * 1 + width, day_width);
}
// JavaScript Document
function load_critical_paths(refresh_parents) {  refresh_parents=refresh_parents || true;
  clean_cps();
  if (refresh_parents == true) {    get_all_parents();
  }
  load_cp_line(0, _tasks.length);
}
function load_cp_line(t, length) {  if (t < length) {    var task_id=_tasks[t]['task_id'];
    var cps=_tasks[t]['critical_paths'];
    var cpl=cps.length;
    if (cpl != 0) {      for (var c=0; c < cpl; c++) {        var cp=cps[c];
        var from_coords=get_coords(task_id);
        var to_coords=get_coords(cp);
        if (from_coords != null && to_coords != null) {          from_coords[0] =
            from_coords[0] * 1 + $id('task_div_' + task_id).offsetWidth;
          build_line(from_coords, to_coords, task_id, cp);
        }
      }
    }
  }
  if (t < length - 1) {    if (t % 15 == 1) {      //do this break so that any before this will show - makes the project appear to load faster
      setTimeout(function() {        load_cp_line(t * 1 + 1, length);
      }, 5);
    } else {      load_cp_line(t * 1 + 1, length);
    }
  } else {  }}
function load_task_critical_paths(task_id, delay) {  if (delay == null) {    if (_task_reschedule != null && task_id != null && task_id != '') {      var task=_tasks[_tasks_key[task_id]];
      if (task != undefined) {        var task_id=task['task_id'];
        var cps=task['critical_paths'];
        var cpl=cps.length;
        if (cpl != 0) {          for (var c=0; c < cpl; c++) {            var cp=cps[c];
            var from_coords=get_coords(task_id);
            var to_coords=get_coords(cp);
            if (from_coords != null && to_coords != null) {              from_coords[0] =
                from_coords[0] * 1 + $id('task_div_' + task_id).offsetWidth;
              build_line(from_coords, to_coords, task_id, cp);
            }
          }
        }
      }
    }
  } else {    load_task_critical_paths(task_id, null);
  }}
function load_defined_critical_path(from, to) {  var from_coords=get_coords(from);
  var to_coords=get_coords(to);
  if (from_coords != null && to_coords != null) {    from_coords[0]=from_coords[0] * 1 + $id('task_div_' + from).offsetWidth;
    build_line(from_coords, to_coords, from, to);
  }}
function get_coords(from) {  var f_x=null;
  var f_y=null;
  if (
    $id('task_div_' + from) &&
    $id('task_div_' + from).getAttribute('var_left') > 0
  ) {    //MAKE SURE THE GROUPS AREN'T HIDDEN
    var task=_tasks[_tasks_key[from]];
    var from_group=task['group_id'];
    var group_visible=is_group_visible(from_group, 0);
    var is_milestone=task['task_type'].toLowerCase() === 'milestone';
    if (group_visible == true && $id('group_bar_target_' + from_group)) {      var from_task=$id('task_div_' + from);
      var from_group_div=$id('group_bar_target_' + from_group);
      if (from_task.parentNode.getAttribute('task_hidden') != 1) {        //FROM
        if (
          _multi_select.move_type != null ||
          task['f_x'] == undefined ||
          task['f_y'] == undefined
        ) {          var f_x=from_task.offsetLeft * 1;
          var f_y=from_task.parentNode.offsetTop;
          task['f_x']=f_x;
          task['f_y']=f_y;
        } else {          f_x=task['f_x'];
          f_y=task['f_y'];
        }
      }
    }
  }
  if (f_x != null && f_y != null) {    return [f_x, f_y, is_milestone];
  } else {    return null;
  }}
var _build_num=0;
function build_line(from_coords, to_coords, from_id, to_id) {  var line_id='cp_box_' + from_id + '_' + to_id;
  //IF MOVING A TASK (dnd) redraw lines just to the needed task
  if (_is_building == null) {    var ele=$id(line_id);
    if (ele) {      ele.parentNode.removeChild(ele);
    }
  }
  var box=draw_line(from_coords, to_coords);
  box.id=_is_building == null ? 'cp_box_' + from_id + '_' + to_id : 'cp_draw';
  $id('critical_paths').appendChild(box);
}
function draw_line(from_coords, to_coords) {  var target=$id('critical_paths');
  var extra_top=$id('task_box').offsetTop - 1 + 2;
  var start_padding=_build_num % 2 == 0 ? 4 : 7;
  start_padding=_task_reschedule == true ? 4 : start_padding;
  var half_day=find_day_width() / 2;
  var from=new Array();
  from['x']=from_coords[0];
  from['y']=from_coords[1] * 1 + extra_top;
  from['is_milestone']=from_coords[2];
  var to=new Array();
  to['x']=to_coords[0] * 1 + 1;
  to['y']=to_coords[1] * 1 + extra_top;
  to['is_milestone']=to_coords[2];
  if (_is_building != 1) {    _build_num++;
  }
  var diff=to['x'] - from['x'];
  if (_multi_select.in_action == true && diff > -3) {    var line_void=false;
  } else if (diff < 0) {    var line_void=true;
  } else {    var line_void=false;
  }
  var day_width=find_day_width() * 0.5;
  var line_void=to_coords[0] + day_width < from_coords[0] ? true : false;
  var margin_top='0.75em';
  var is_invalid=line_void ? ' invalid' : '';
  var height=$id('hidden_row_height').offsetHeight / 2 + 2;
  if (is_invalid !== '') {    to['y']=to['y'] + 2;
  }
  var last_x=null;
  var last_y=null;
  var box=$create('DIV');
  function build_line() {    var line=$create('DIV');
    line.style.position='absolute';
    line.style.marginTop=margin_top;
    return line;
  }
  //LINE OUT OF TASK
  var line1=build_line();
  last_x=from['x'] - 1;
  last_y=from['y'];
  var width=start_padding * 1;
  if (from['is_milestone']) {    last_x -= half_day;
    width += half_day;
  }
  line1.style.top=last_y + 'px';
  line1.style.left=last_x + 'px';
  line1.style.width=width * 1 + 1 + 'px';
  line1.style.height=0;
  line1.className='border_bottom' + is_invalid;
  //set coords for next line to pick up
  last_x=last_x - 1 + width;
  last_y=last_y;
  box.appendChild(line1);
  //UP OR DOWN LINE (should only be on invalid lines)
  var used_invalid=false;
  if (to['x'] < from['x']) {    used_invalid=true;
    var line2=build_line();
    line2.style.left=last_x + 'px';
    if (to['y'] > from['y']) {      // to task is lower on the chart than the from task
      line2.style.top=last_y + 'px';
      line2.style.height=height - 1 + 1 + 'px';
      //set coords for next line to pick up
      last_x=last_x;
      last_y=last_y * 1 + height - 2;
    } else {      last_y=last_y - 1 + 3;
      var last_y=last_y - height;
      line2.style.top=last_y + 'px';
      line2.style.height=height + 'px';
      //set coords for next line to pick up
      last_x=last_x;
      last_y=last_y;
    }
    line2.className='border_left' + is_invalid;
    box.appendChild(line2);
    var line3=build_line();
    var width=from['x'] - to['x'] + start_padding * 3;
    var last_x=last_x - width;
    line3.style.width=width + 'px';
    line3.className='border_bottom' + is_invalid;
    line3.style.left=last_x + 'px';
    line3.style.top=last_y + 'px';
    line3.style.height=0;
    //set coords for next line to pick up
    last_x=last_x;
    last_y=last_y;
    box.appendChild(line3);
  }
  var line4=build_line();
  line4.className='border_left' + is_invalid;
  line4.style.left=last_x + 'px';
  if (from['y'] < to['y']) {    // to task is lower on the chart than the from task
    var height_diff=to['y'] - from['y'];
    var line_height=used_invalid ? height_diff - height : height_diff;
    line4.style.top=last_y + 'px';
    var vlheight=line_height + 1 < 0 ? 0 : line_height + 1;
    line4.style.height=vlheight + 'px';
    //set coords for next line to pick up
    last_x=last_x;
    last_y=last_y * 1 + line_height;
  } else {    var height_diff=from['y'] - to['y'];
    var line_height=used_invalid ? height_diff - height : height_diff;
    last_y=last_y - line_height;
    line4.style.top=last_y + 'px';
    var vlheight=line_height < 0 ? 0 : line_height;
    line4.style.height=vlheight + 'px';
    //set coords for next line to pick up
    last_x=last_x;
    last_y=last_y;
  }
  box.appendChild(line4);
  var line5=build_line();
  line5.className='border_bottom' + is_invalid;
  line5.style.top=last_y + 'px';
  line5.style.left=last_x + 'px';
  line5.style.height=0;
  var x_width=to['x'] - last_x > 0 ? to['x'] - last_x : 0;
  if (to['is_milestone']) {    x_width += half_day;
  }
  line5.style.width=x_width + 'px';
  box.appendChild(line5);
  return box;
}
function clean_cps() {  remove_child_nodes($id('critical_paths'));
  var tl=_tasks.length;
  for (var t=0; t < tl; t++) {    delete _tasks[t]['f_x'];
    delete _tasks[t]['f_y'];
  }}
//DRAG AND DROP TO CREATE NEW CP
var _build_from=null;
var _build_to=null;
var _is_building=null;
var _build_target=null;
function start_build_new_cp(start_from, task_id) {  if (allow_hover) {    allow_hover=false;
    if (start_from == 'from') {      _build_from=task_id;
      _cp_build_task=null;
      _is_building=1;
      addListener($id('tg_body'), 'mouseup', finish_build, false);
      addListener(window, 'keydown', check_key, false); //firefox fix
      addListener($id('tg_body'), 'keydown', check_key, false);
      disable_selection(document.body);
      start_move('cp_from');
    } else if (start_from == 'to') {      _build_to=task_id;
      _cp_build_task=null;
      _is_building=1;
      addListener($id('tg_body'), 'mouseup', finish_build, false);
      addListener(window, 'keydown', check_key, false); //firefox fix
      addListener($id('tg_body'), 'keydown', check_key, false);
      disable_selection(document.body);
      start_move('cp_to');
    }
    //UNHIGHLIGHT CPS
    highlight_cps('task', task_id, 'remove');
    $id('critical_paths').className='drawing';
  }}
function build_to_task(task_id) {  _build_target=task_id;
  if (_build_to == null && _build_from != null) {    //get_coords(_build_from, task_id);
  } else if (_build_from == null && _build_to != null) {    //get_coords(task_id, _build_to);
  }}
function finish_build() {  var target_task=_cp_build_task;
  var display_error=true;
  if ($id('cp_draw')) {    $id('cp_draw').parentNode.removeChild($id('cp_draw'));
  }
  var from_task=null;
  var to_task=null;
  if (_build_to == null && _build_from != null) {    from_task=_build_from;
    to_task=target_task;
  } else if (_build_from == null && _build_to != null) {    from_task=target_task;
    to_task=_build_to;
  } else if (_build_from != null && _build_to != null) {    from_task=_build_from;
    to_task=_build_to;
    display_error=false;
  }
  close_cp_create();
  // catch invalid dependencies
  var is_invalid_dependency=from_task == 0
    || to_task == 0
    || from_task === null
    || to_task === null;
  if (is_invalid_dependency) {    return;
  }
  var project_id=_tasks[_tasks_key[from_task]]['project_id'];
  var body={    to_task: {      id: to_task,
    },
  };
  var callback=function(response) {    allow_hover=true;
    if (!response.ok) {      custom_alert(response.json.error.message);
      load_critical_paths();
      return;
    }
    //UPDATE FROM TASK CHILD
    var task_key=_tasks_key[from_task];
    var array_len=_tasks[task_key]['critical_paths'].length;
    _tasks[task_key]['critical_paths'][array_len]=to_task;
    _tasks[task_key]['critical_paths_data'].push({      id: response.json.id,
      to_task_id: to_task
    });
    //UPDATE TO TASK PARENT
    var array_len=_tasks[_tasks_key[to_task]]['parents'].length;
    _tasks[_tasks_key[to_task]]['parents'][array_len]=from_task;
    load_defined_critical_path(from_task, to_task);
    track_segment_event('dependency_created');
    track_segment_event('gantt-created-a-dependency');
  }
  new $ajax({    type: 'POST',
    url: API_URL + 'v1/tasks/' + from_task + '/dependencies',
    data: body,
    response: handle_response(callback),
  });
}
function close_cp_create() {  allow_hover=true;
  highlight_row('task', _build_from, 'hover_off');
  highlight_row('task', _build_to, 'hover_off');
  highlight_row('task', _build_target, 'hover_off');
  removeListener($id('tg_body'), 'mouseup', finish_build);
  removeListener($id('tg_body'), 'keydown', check_key);
  clear_text();
  enable_selection(document.body);
  _build_from=null;
  _build_to=null;
  _is_building=null;
  _build_target=null;
  _cp_build_task=null;
}
/* CONTROL FROM BADGES */
function load_item_cps(task_id, type) {  //GET CONNECTED CPS
  var cps=_tasks[_tasks_key[task_id]]['critical_paths'];
  var task_names=new Array();
  var counter=0;
  var cpl=cps.length;
  for (var c=0; c < cpl; c++) {    if (_tasks[_tasks_key[cps[c]]]) {      task_names[counter]=[cps[c], _tasks[_tasks_key[cps[c]]]['task_name']];
      counter++;
    }
  }
  task_names.sort(sortMultiDimensional);
  var div=$create('DIV');
  div.className='remove_cp';
  div.setAttribute('hover', 1);
  div.setAttribute('task_id', task_id);
  div.onmouseout=function() {    this.setAttribute('hover', 0);
    check_close_delete_cp(this, null);
  };
  div.onmousemove=function() {    this.setAttribute('hover', 1);
  };
  var d2=$create('DIV');
  d2.className='remove_critical_path';
  d2.appendChild($text('Dependency'));
  div.appendChild(d2);
  var ul=$create('UL');
  div.appendChild(ul);
  var tnl=task_names.length;
  for (var l=0; l < tnl; l++) {    var id=task_names[l][0];
    var task_name=task_names[l][1];
    var li=$create('LI');
    var span=$create('SPAN');
    span.appendChild($text('remove'));
    li.appendChild(span);
    li.appendChild($text(task_name));
    li.setAttribute('link_id', id);
    li.setAttribute('task_id', task_id);
    li.onmouseover=function() {      var cp_line=$id(
        'cp_box_' + task_id + '_' + this.getAttribute('link_id')
      );
      if (cp_line) {        cp_line.className='highlight_cp';
        allow_hover=true;
        highlight_row('task', this.getAttribute('link_id'), 'remove');
        allow_hover=false;
      }
    };
    li.onmouseout=function() {      var cp_line=$id(
        'cp_box_' + task_id + '_' + this.getAttribute('link_id')
      );
      if (cp_line) {        cp_line.className='';
        allow_hover=true;
        highlight_row('task', this.getAttribute('link_id'), 'hover_off');
        allow_hover=false;
      }
    };
    li.onclick=function() {      var cps=new Array();
      var task=_tasks[_tasks_key[this.getAttribute('task_id')]];
      var cpl=task['critical_paths'].length;
      for (var c=0; c < cpl; c++) {        if (task['critical_paths'][c] != this.getAttribute('link_id')) {          var len=cps.length;
          cps[len]=task['critical_paths'][c];
        } else {          allow_hover=true;
          highlight_row('task', task['critical_paths'][c], 'hover_off');
          allow_hover=false;
        }
      }
      task['critical_paths']=cps;
      this.parentNode.removeChild(this);
      load_critical_paths();
      save_value(
        'remove_cp',
        this.getAttribute('task_id'),
        this.getAttribute('link_id')
      );
    };
    ul.appendChild(li);
  }
  if (task_names.length == 0) {    /*
var li=$create("LI");
li.appendChild($text("There are no dependencies connected to this task"));
ul.appendChild(li);
*/
  }
  var target=type == 'task' ? $id('task_cps') : $id('milestone_cps');
  remove_child_nodes(target);
  var dv=$create('DIV');
  dv.className='delete_cp';
  dv.appendChild($text('Dependencies:'));
  target.appendChild(dv);
  target.className='delete_cps';
  target.appendChild(ul);
  allow_hover=false;
}
function delete_critical_path(from_task, to_task) {  var task=_tasks[_tasks_key[from_task]];
  var data=task['critical_paths_data'];
  var dependency=data.filter(function(critical_path) {    return critical_path.to_task_id == to_task;
  });
  var id=dependency[0].id || null;
  if (!id) {    return;
  }
  // Remove this dependency from the array
  _tasks[_tasks_key[from_task]]['critical_paths_data'] =
    data.filter(function (critical_path) {      return critical_path.id != id;
    });
  new $ajax({    type: 'DELETE',
    url: API_URL + 'v1/tasks/'+from_task+'/dependencies/'+id,
    response: function() { },
  });
}
// JavaScript Document
function delay_hover_off(x, y)
{setTimeout( function() { highlight_row(x, y, "hover_off"); }, 10);
}
function quick_add_position(ele, group_id)
{ele.setAttribute("group_id", group_id);
ele.onmouseup=function() {if(_multi_select.move_direction == "vertical" && _multi_select.vdnd_over == "")
{_multi_select.save_vdnd("group_line_after", this.getAttribute("group_id"));
}}
}
function add_multi_select(ele, type, type_id)
{if(ele)
{//SET ATTRIBUTES
ele.setAttribute(type+"_id", type_id);
ele.setAttribute("type", type);
ele.setAttribute("type_id", type_id);
ele.setAttribute("mousedown",0);
//APPEND FUNCTIONS
ele.onmousedown=function() {this.setAttribute("mousedown",1);
      var type=this.getAttribute("type");
      if(type === "group") {        track_segment_event('gantt-selected-a-group-bar-for-dnd');
      } else if(type === "project") {        track_segment_event('gantt-selected-a-project-bar-for-dnd');
      }};
ele.onmouseup=function() {var type=this.getAttribute("type");
var type_id=this.getAttribute("type_id");
this.setAttribute("mousedown",0);
if(type == "task")
{if(_multi_select.move_direction == "vertical")
{_multi_select.save_vdnd("task_ele", type_id);
this.parentNode.onmouseup=null;
}}
else if(type == "group")
{if(_multi_select.move_direction == "vertical")
{_multi_select.save_vdnd("group_ele", type_id);
this.parentNode.onmouseup=null;
}}
else if(type == "project")
{if(_multi_select.move_direction == "vertical")
{_multi_select.save_vdnd("project_line", type_id);
this.parentNode.onmouseup=null;
}}
};
ele.onclick=function() {var type=this.getAttribute("type");
var type_id=this.getAttribute("type_id");
if(type == "task")
{if(_is_shift == true)
{_multi_select.shift_select(type, type_id);
track_segment_event('gantt-selected-multiple-task-bars-for-dnd', {'key': 'shift'});
}
else if(_command == true)
{_multi_select.add(type, type_id, false, true);
track_segment_event('gantt-selected-multiple-task-bars-for-dnd', {'key': 'meta'});
}
else
{unhighlight_all();
_multi_select.clear(true);
_multi_select.add(type, type_id, false, true);
track_segment_event('gantt-selected-a-task-bar-for-dnd');
}}
else if(type == "group" || type == "project")
{_multi_select.clear(true);
}};
ele.onmousemove=function() { move_check(this, null); };
if(type == "task")
{//IN gantt.add_edit_controls.js
}
else if(type == "group")
{ele.onmouseover=function() {if(_multi_select.move_direction == "vertical")
{highlight_row(this.getAttribute("type"), this.getAttribute("type_id"), "moving_highlight");
}};
}
else if(type == "project")
{ele.onmouseover=function() {if(_multi_select.move_direction == "vertical")
{highlight_row(this.getAttribute("type"), this.getAttribute("type_id"), "moving_highlight");
}};
}}
}
function move_check(ele, x)
{if(ele.getAttribute("mousedown") == 1)
{if(x == null && _multi_select.in_selection == true)
{setTimeout(function() { move_check(ele, 1); }, 100);
}
else if(_multi_select.in_action == false)
{if(_is_shift != true && _command != true && js_in_array(ele.getAttribute("type_id"), _multi_select.element_ids) == -1)
{_multi_select.clear(true);
}
var type=ele.getAttribute("type");
var type_id=ele.getAttribute("type_id");
if(type == "task")
{_multi_select.add(type, type_id, true, true);
ele.setAttribute("mousedown",0);
}
else if(type == "group")
{_multi_select.add_group(type_id);
_multi_select.start("move", "unknown");
ele.setAttribute("mousedown",0);
}
else if(type == "project")
{_multi_select.add_project(type_id);
_multi_select.start("move", "unknown");
ele.setAttribute("mousedown",0);
}}
}}
function reset_cp_chain(task_id)
{if(task_id != undefined && task_id != "")
{load_task_critical_paths(task_id, null);
//UPDATE CHILDREN
if(_tasks[_tasks_key[task_id]] != undefined)
{var children=_tasks[_tasks_key[task_id]]['critical_paths'];
var clen=children.length;
for(var c=0; c < clen; c++)
{reset_cp_chain(children[c]);
}
//UPDATE TASK PARENTS
var parents=_tasks[_tasks_key[task_id]]['parents'];
if(parents instanceof Array)
{var pl=parents.length;
for(var p=0; p < pl; p++)
{if(js_in_array(parents[p], _multi_select.element_ids) == -1) {load_defined_critical_path(parents[p], task_id);
}}
}}
}}
var _dnd_x=null;
var _dnd_y=null;
var _dnd_moves=0;
var _task_reschedule=null;
var _to1=null;
var _to2=null;
var _still_update=null;
var _still_updates=0;
function run_still_update()
{_still_update=setInterval( function() {  _still_updates++;
  if(_still_updates <= 15)
  {  _multi_select.moved=[];
  _multi_select.move_children(null);
  }
  else
  {  clearInterval(_still_update);
  }}, 150);
}
function mouse_position(e)
{_dnd_x=(window.Event && document.captureEvents) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
_dnd_y=(window.Event && document.captureEvents) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
_dnd_moves++;
//STOP TIMEOUTS FROM RUNNING AGAIN
clearTimeout(_to1);
clearTimeout(_to2);
clearInterval(_still_update);
//MOVE
_multi_select.move();
//SETUP NEW TIMEOUTS
_to1=setTimeout(function() {_multi_select.update_cps(true);
}, 500);
_still_updates=0;
_to2=setTimeout(function() {_multi_select.move();
run_still_update();
}, 250);
}
var _multi_select_default=new function() {this.elements=[];
this.element_ids=[];
this.move_type=null;
this.move_direction=null;
this.start_x=null;
this.start_y=null;
this.in_selection=false;
this.in_action=false;
this.move_count=0;
this.redraw_cp=true;
this.move_groups=[];
this.move_projects=[];
this.day_width=10;
this.allow_cp_redraw=true;
this.remove_slack=false;
this.already_hidden=[];
this.moved=[];
this.cancel_save=false;
this.vdnd_over=null;
this.vdnd_over_id=null;
this.vdnd_last_over=null;
this.vdnd_last_over_id=null;
this.vdnd_from="right";
this.vdnd_y_adjustment=20;
this.extra_top=0;
this.min_left=0;
this.max_right=0;
  this.initial_positions=null;
this.saved_elements=[];
this.update_hours=0;
this.add_project=function(project_id) {var target=$id("project_bar_target_"+project_id);
var divs=target.getElementsByTagName("DIV");
var dl=divs.length;
for(var d=0; d < dl; d++)
{if(divs[d].id.indexOf("task_div_") == 0 && divs[d].id.indexOf("task_div_hours_") == -1)
{if(divs[d].parentNode.getAttribute("task_hidden") == null && divs[d].parentNode.getAttribute("nodate") == null) {this.add("task",divs[d].getAttribute("type_id"), false, false);
}}
}
this.define();
var len=this.move_projects.length;
this.move_projects[len]=project_id;
};
this.add_group=function(group_id) {var target=$id("group_bar_target_"+group_id);
var divs=target.getElementsByTagName("DIV");
var dl=divs.length;
for(var d=0; d < dl; d++)
{if(divs[d].id.indexOf("task_div_") == 0 && divs[d].id.indexOf("task_div_hours_") == -1)
{if(divs[d].parentNode.getAttribute("task_hidden") == null && divs[d].parentNode.getAttribute("nodate") == null) {this.add("task",divs[d].getAttribute("type_id"), false, false);
}}
}
if($id("category_div_"+group_id).nextSibling) {$id("category_div_"+group_id).nextSibling.className += " hidden";
}
this.define();
var len=this.move_groups.length;
this.move_groups[len]=group_id;
};
this.add=function(type, type_id, do_start, define_variables) {if(type_id.indexOf("new-task") == -1)
{do_start=do_start || false;
define_variables=define_variables || true;
//SEE IF TASK HAS NO DATES - IF SO FAIL
var pass=true;
if(js_in_array(type_id, this.element_ids) == -1 && this.in_action == false && pass == true)
{//DEFINE ELEMENT INFORMATION (the task & it's children)
var len=this.elements.length;
this.elements[len]=[];
this.elements[len]['ele']=$id(type+"_div_"+type_id);
this.elements[len]['task_id']=type_id;
this.element_ids[len]=type_id;
//HIDE THE BADGES
if(this.elements.length > 1)
{if(len == 1)
{//same code as below - just hiding the first element
if(this.elements[0]['ele'] && this.elements[0]['ele'].nextSibling) {this.elements[0]['ele'].nextSibling.className += " keep_arrows";
}}
if(this.elements[len]['ele'] && this.elements[len]['ele'].nextSibling) {this.elements[len]['ele'].nextSibling.className += " keep_arrows";
}}
$id(type+"_"+type_id).setAttribute("lock_off", 1);
highlight_row(type, type_id, "hover_on");
highlight_row(type, type_id, "selected");
}
if(define_variables == true) {this.define();
}
if(do_start == true) {this.start("move", "unknown");
}}
};
this.define=function() {this.day_width=find_day_width();
this.redraw_cp=$id("redraw_cp_on_drag").checked;
this.remove_slack=$id("dnd_remove_slack").checked;
this.vdnd_y_adjustment=$id("header").offsetHeight*-1 + $id("task_box").offsetTop*-1 + 30;
var header_top=$id("header").offsetHeight;
header_top=(header_top == 0) ? 15 : -1;
      this.extra_top=$id("task_box").offsetTop*1 + header_top*1 + 9;
    if (get_is_embedded_view()) {      this.vdnd_y_adjustment -= 20;
      this.extra_top += 28;
    }
    this.allow_cp_redraw=($id("redraw_cp_on_drag").checked) ? true : false;
this.saved_elements=[];
//LET THE FUNCTION KNOW WE WANT TO MOVE THINGS
this.in_selection=true;
this.cancel_control(true);
this.cancel_save=false;
disableSelection(document.body);
clear_text();
};
this.shift_select=function(type, type_id) {if(this.elements.length > 0)
{var earliest=this.elements[0]['ele'].id; //get first selected element
var latest=type+"_div_"+type_id; //the id of the element just selected
this.clear(true); // clear all
var first=null;
var last=null;
var divs=$id("task_box").getElementsByTagName("DIV");
var dl=divs.length;
for(var d=0; d < dl; d++)
{var div=divs[d];
if(div.id.indexOf("task_div_") > -1 && div.id.indexOf("task_div_hours_") == -1)
{first=(div.id == earliest) ? 1 : first;
last=(div.id == latest) ? 1 : last;
//if(first != 1 && last != 1 && first != null && last != null)
if(first == 1 && last == null || first == null && last == 1)
{if(div.parentNode.getAttribute("task_hidden") == null) {this.add(div.getAttribute("type"), div.getAttribute("type_id"));
}}
else if(first == 1 && last == 1 && (div.id == earliest || div.id == latest))
{this.add(div.getAttribute("type"), div.getAttribute("type_id"));
}
else if(first == 1 && last == 1)
{d=divs.length*2;
}}
}
}
else
{this.add(type, type_id);
}}
this.cancel_control=function(enable) {var eles=[$id("cancel_clicker")];
var el=eles.length;
for(var e=0; e < el; e++)
{if(enable == true) {eles[e].onclick=function() {_multi_select.clear(true);
_multi_select.done();
};
if(eles[e].id == "cancel_clicker")
{eles[e].className="";
}}
else
{eles[e].onclick=null;
eles[e].style.background="";
if(eles[e].id == "cancel_clicker")
{eles[e].className="hidden";
}}
}
}
this.start=function(type, direction) {this.move_type=type;
if(direction == "unknown")
{if(_dnd_moves == 0) {this.begin();
}
if(_dnd_moves == 1)
{this.start_x=_dnd_x;
this.start_y=_dnd_y;
}
else if(_dnd_moves >= 5)
{var x_diff=this.start_x - _dnd_x;
var y_diff=this.start_y - _dnd_y;
x_diff=(x_diff < 0) ? x_diff*-1 : x_diff;
y_diff=(y_diff < 0) ? y_diff*-1 : y_diff;
var width=find_day_width();
width=width*5;
if(x_diff > width*1/10)
{this.move_direction="horizontal";
this.start(type, "horizontal");
}
else if(y_diff > 30 || y_diff > x_diff)
{//IF MOVING UP AND DOWN
this.move_direction="vertical";
this.start(type, "vertical");
}
else
{this.move_direction="horizontal";
this.start(type, "horizontal");
}}
}
else if(direction == "horizontal")
{this.move_direction="horizontal";
this.begin();
this.hide_stuff();
this.move();
clear_text();
}
else if(direction == "vertical")
{this.begin();
this.hide_stuff();
this.move_direction="vertical";
//BUILD THE TEMPORARY DIV
if(true)
{var div=$create("DIV")
div.id="vdnd_block";
div.style.fontSize=$id("font_size").value + "px";
div.style.width=$id("task_box").offsetWidth + "px";
$id("task_box").appendChild(div);
allow_hover=true;
var el=this.elements.length;
for(var i=0; i < el; i++)
{if(this.elements[i]['ele'])
{this.elements[i]['ele'].parentNode.removeAttribute("lock_off");
this.elements[i]['ele'].parentNode.onmouseup=null;
this.elements[i]['ele'].parentNode.onmouseover=null;
this.elements[i]['ele'].parentNode.onmouseout=null;
this.elements[i]['ele'].onmouseup=null;
this.elements[i]['ele'].onmouseover=null;
this.elements[i]['ele'].onmouseout=null;
}
if($id("task_meta_"+this.elements[i]['task_id'])) {$id("task_meta_"+this.elements[i]['task_id']).onmouseover=null;
}
$id("task_title_"+this.elements[i]['task_id']).onmouseover=null;
if(this.move_groups.length == 0)
{if(this.elements[i]['ele'])
{div.appendChild(this.elements[i]['ele']);
this.elements[i]['ele'].style.position="relative";
this.elements[i]['ele'].style.top="auto";
}}
highlight_row("task", this.elements[i]['task_id'], "hover_off");
$id("task_name_"+this.elements[i]['task_id']).className += " in_action";
}
var mgl=this.move_groups.length;
for(var i=0; i < mgl; i++)
{var parent=$id("category_div_"+this.move_groups[i]);
parent.onmouseover=null;
parent.onmouseout=null;
parent.onmouseup=null;
parent.parentNode.onmouseup=null;
parent.parentNode.onmouseover=null;
parent.parentNode.onmouseout=null;
highlight_row("group", this.move_groups[i], "hover_off");
div.appendChild(parent);
parent.style.position="relative";
parent.style.top="auto";
var child=$id("group_bar_target_"+this.move_groups[i]);
var divs=child.getElementsByTagName("DIV");
var dl=divs.length;
for(var d=0; d < dl; d++)
{if(divs[d]) {divs[d].onmouseover=null;
divs[d].onmouseout=null;
divs[d].onmouseup=null;
if(divs[d].className.indexOf("category_in_chart") > -1 || divs[d].className.indexOf("task_in_chart") > -1 || divs[d].className.indexOf("milestone_in_chart") > -1)
{if(divs[d].className.indexOf("category_in_chart") > -1)
{var group_id=divs[d].parentNode.getAttribute("group_id");
//DISABLE THE SUB GROUP ROW
$id("list_group_"+group_id).className += " in_action";
if($id("category_meta_"+group_id)) {$id("category_meta_"+group_id).onmouseover=null;
}
$id("category_title_"+group_id).onmouseover=null;
}
divs[d].style.position="relative";
divs[d].style.top="auto";
div.appendChild(divs[d]);
}}
}
$id("list_group_"+this.move_groups[i]).className += " in_action";
//DISABLE HOVER OF THE GROUP
if($id("category_meta_"+this.move_groups[i])) {$id("category_meta_"+this.move_groups[i]).onmouseover=null;
}
$id("category_title_"+this.move_groups[i]).onmouseover=null;
//DISABLE HOVER ON THE QUICK ADD ROW
if($id("task_meta_quick_add_"+this.move_groups[i])) {$id("task_meta_quick_add_"+this.move_groups[i]).onmouseover=null;
}
if($id("task_title_quick_add_"+this.move_groups[i])) {$id("task_title_quick_add_"+this.move_groups[i]).onmouseover=null;
}
if($id("task_quick_add_"+this.move_groups[i])) {$id("task_quick_add_"+this.move_groups[i]).onmouseover=null;
}}
}
this.cancel_control(false);
this.move();
clear_text();
document.body.style.cursor="move";
}
else if(direction == "extend_back" || direction == "extend_front")
{this.move_direction=direction;
this.begin();
this.move();
this.hide_stuff();
clear_text();
if(direction == "extend_back") {document.body.style.cursor="col-resize";
} else if(direction == "extend_front") {document.body.style.cursor="col-resize";
}
//CLOSE TOOL TIP
if(_tooltip_step == "resize" && _tooltip_progress == 1) {close_tooltip("resize");
_tooltip_progress=2;
_tooltip_force_task=this.elements[0]['task_id'];
}}
};
this.adjust_selection=function(enable) {if(enable == true)
{var cursor=(this.move_direction == "vertical") ? "row-resize" : "default";
cursor=(this.move_direction == "horizontal") ? "col-resize" : cursor;
cursor=(this.move_direction == "extend_back") ? "col-resize" : cursor;
cursor=(this.move_direction == "extend_front") ? "col-resize" : cursor;
disableSelection(document.body, cursor);
disableSelection($id("meta_data"), cursor);
disableSelection($id("category_task_list"), cursor);
disableSelection($id("tasks"), cursor);
}
else
{enableSelection(document.body);
enableSelection($id("meta_data"));
enableSelection($id("category_task_list"));
enableSelection($id("tasks"));
}};
this.begin=function() {document.onmousemove=mouse_position;
document.onmouseup=kill_move;
this.adjust_selection(true);
//MAKE SURE THERE ARE NO BLANK DATES SELECTED
if(this.move_direction == "horizontal" || this.move_direction == "extend_back" || this.move_direction == "extend_front")
{var tel=this.element_ids.length;
for(var i=0; i < tel; i++)
{var div=$id("task_"+this.element_ids[i]);
if(div.getAttribute("nodate") != null) {this.elements[i]['skip']=true;
this.elements[i]['ele'].style.marginLeft="-1002px";
}}
}
this.in_selection=false;
this.in_action=true;
_task_reschedule=true;
allow_hover=false;
};
this.hide_stuff=function() {var ell=this.element_ids.length;
for(var i=0; i < ell; i++)
{$id("task_"+this.element_ids[i]).className=($id("task_"+this.element_ids[i]).className).replace(/show_badges/g,"");
}
//HIDE BADGES COMPLETE
for(var x in this.elements)
{if(this.elements[x]['ele'] && this.elements[x]['ele'].nextSibling) {this.elements[x]['ele'].nextSibling.className += " hidden";
}
//UPDATE CHILDREN
if(_tasks[_tasks_key[this.elements[x]['task_id']]])
{var children=_tasks[_tasks_key[this.elements[x]['task_id']]]['critical_paths'];
for(var c=0; c < children.length; c++)
{this.already_hidden.push(children[c]);
this.hide_children(children[c]);
}}
}};
this.hide_children=function(child) {var ele=$id("task_div_"+child);
if(ele != null)
{ele.nextSibling.className += " hidden";
var children=_tasks[_tasks_key[child]]['critical_paths'];
for(var c=0; c < children.length; c++)
{if(js_in_array(children[c],this.already_hidden) == -1)
{this.already_hidden.push(children[c]);
this.hide_children(children[c]);
}}
}};
this.move=function() {this.move_count++;
//FOR VERTICAL BACKGROUND
this.min_left=0;
this.max_right=0;
this.moved=[];
if(this.move_direction == null)
{this.start(this.move_type, "unknown");
}
else if(this.start_x == null || this.start_y == null)
{this.start_x=_dnd_x;
this.start_y=_dnd_y;
}
else
{var x_diff=_dnd_x - this.start_x;
this.adjust_selection(true);
if(this.in_action != false)
{        if (this.move_direction === 'horizontal' || this.move_direction === 'extend_back' || this.move_direction === 'extend_front') {          // Set the initial positions of the tasks being moved. The called function will make sure it only runs once.
          this.set_initial_task_positions(this.element_ids);
        }
if(this.move_direction == "horizontal")
{//MOVING TASKS LEFT TO RIGHT
//MOVE PROJECT BARS
for(var p=0; p < this.move_projects.length; p++)
{$id("project_div_"+this.move_projects[p]).style.left=x_diff +"px";
}
//MOVE GROUP BARS
for(var g=0; g < this.move_groups.length; g++)
{$id("category_div_"+this.move_groups[g]).style.left=x_diff +"px";
}
//MOVE SIDE TO SIDE
for(var i=0; i < this.elements.length; i++)
{if(typeof this.elements[i]['skip'] == "undefined")
{var cur_left=(_tasks[_tasks_key[this.element_ids[i]]]['def_left']*1 + x_diff);
this.elements[i]['ele'].style.marginLeft=cur_left +"px";
_tasks[_tasks_key[this.element_ids[i]]]['var_left']=cur_left;
//UPDATE LEFT & RIGHT
var left=_tasks[_tasks_key[this.element_ids[i]]]['var_left'];
var right=left*1 + _tasks[_tasks_key[this.element_ids[i]]]['var_width'];
this.min_left=(left < this.min_left || this.min_left == 0) ? left : this.min_left;
this.max_right=(right > this.max_right || this.max_right == 0) ? right : this.max_right;
}
else if(_move_type == "task_draw") {//do nothing
}
else
{this.elements[i]['ele'].style.marginLeft="-1001px";
this.elements[i]['ele'].parentNode.setAttribute("nodate", "true");
}}
this.move_children(null);
this.move_bg(this.min_left, this.max_right);
if(this.redraw_cp == true && this.move_count % 2 == 0) { this.update_cps(); }}
else if(this.move_direction == "extend_back")
{//EXTEND THE BACK
for(var i=0; i < this.elements.length; i++)
{if(typeof this.elements[i]['skip'] != "undefined")
{//DO NOTHING
}
else if(_tasks[_tasks_key[this.element_ids[i]]]['task_type'].toLowerCase() == "task")
{var new_width=(_tasks[_tasks_key[this.element_ids[i]]]['def_width']*1 + x_diff -2);
new_width=(new_width < this.day_width) ? this.day_width : new_width;
this.elements[i]['ele'].style.width=new_width +"px";
_tasks[_tasks_key[this.element_ids[i]]]['var_width']=new_width;
}
else
{//if milestone
var cur_left=(_tasks[_tasks_key[this.element_ids[i]]]['def_left']*1 + x_diff);
cur_left=(cur_left <= _tasks[_tasks_key[this.element_ids[i]]]['def_left']) ? _tasks[_tasks_key[this.element_ids[i]]]['def_left'] : cur_left;
this.elements[i]['ele'].style.marginLeft=cur_left +"px";
_tasks[_tasks_key[this.element_ids[i]]]['var_left']=cur_left;
}
//UPDATE LEFT & RIGHT
var left=_tasks[_tasks_key[this.element_ids[i]]]['var_left'];
var right=left*1 + _tasks[_tasks_key[this.element_ids[i]]]['var_width'];
this.min_left=(left < this.min_left || this.min_left == 0) ? left : this.min_left;
this.max_right=(right > this.max_right || this.max_right == 0) ? right : this.max_right;
}
this.move_children(null);
this.move_bg(this.min_left, this.max_right);
if(this.redraw_cp == true && this.move_count % 2 == 0) { this.update_cps(); }}
else if(this.move_direction == "extend_front")
{//EXTEND THE BACK
for(var i=0; i < this.elements.length; i++)
{if(typeof this.elements[i]['skip'] != "undefined")
{//DO NOTHING
}
else if(_tasks[_tasks_key[this.element_ids[i]]]['task_type'].toLowerCase() == "task")
{var new_left=(_tasks[_tasks_key[this.element_ids[i]]]['def_left']*1 + x_diff);
new_left=(new_left < 0) ? 0 : new_left;
var new_width=(_tasks[_tasks_key[this.element_ids[i]]]['def_width']*1 + x_diff*-1);
if(new_width < this.day_width)
{new_left=(_tasks[_tasks_key[this.element_ids[i]]]['def_left']*1 + _tasks[_tasks_key[this.element_ids[i]]]['def_width']*1) - this.day_width;
new_width=this.day_width;
}
this.elements[i]['ele'].style.marginLeft=new_left +"px";
this.elements[i]['ele'].style.width=new_width +"px";
_tasks[_tasks_key[this.element_ids[i]]]['var_left']=new_left;
_tasks[_tasks_key[this.element_ids[i]]]['var_width']=new_width;
}
else
{//if milestone
var cur_left=(_tasks[_tasks_key[this.element_ids[i]]]['def_left']*1 + x_diff);
cur_left=(cur_left >= _tasks[_tasks_key[this.element_ids[i]]]['def_left']) ? _tasks[_tasks_key[this.element_ids[i]]]['def_left'] : cur_left;
this.elements[i]['ele'].style.marginLeft=cur_left +"px";
_tasks[_tasks_key[this.element_ids[i]]]['var_left']=cur_left;
}
//UPDATE LEFT & RIGHT
var left=_tasks[_tasks_key[this.element_ids[i]]]['var_left'];
var right=left*1 + _tasks[_tasks_key[this.element_ids[i]]]['var_width'];
this.min_left=(left < this.min_left || this.min_left == 0) ? left : this.min_left;
this.max_right=(right > this.max_right || this.max_right == 0) ? right : this.max_right;
}
this.move_bg(this.min_left, this.max_right);
}
else if(this.move_direction == "vertical")
{//MOVE UP AND DOWN
var vdnd_block=$id("vdnd_block");
if(vdnd_block != null) {vdnd_block.style.top=(_dnd_y*1 + this.vdnd_y_adjustment) +"px";
}}
}}
};
this.move_children=function(task_id) {if(task_id == null)
{for(var i=0; i < this.element_ids.length; i++)
{var cps=_tasks[_tasks_key[this.element_ids[i]]]['critical_paths'];
for(var c=0; c < cps.length; c++)
{this.move_child(cps[c]);
}
for(var c=0; c < cps.length; c++)
{this.move_children(cps[c]);
}}
}
else
{if(js_in_array(task_id, this.moved) == -1)
{if(_tasks[_tasks_key[task_id]])
{            // mark as moved first so that subsequent recursive calls will know it's been handled
            this.moved.push(task_id);
this.move_child(task_id);
var cps=_tasks[_tasks_key[task_id]]['critical_paths'];
for(var c=0; c < cps.length; c++)
{this.move_children(cps[c]);
}}
}
else
{//ALREADY MOVED - DOES NOT NEED TO MOVE AGAIN
}}
};
this.move_child=function(task_id) {if(js_in_array(task_id, this.element_ids) == -1)
{var left=0;
var task_i=_tasks_key[task_id];
if(_tasks[task_i] && _tasks[task_i]['parents'])
{var parents=_tasks[task_i]['parents'];
for(var i=0; i < parents.length; i++)
{if(_tasks[_tasks_key[parents[i]]])
{var temp_left=_tasks[_tasks_key[parents[i]]]['var_left'];
var temp_width=_tasks[_tasks_key[parents[i]]]['var_width'];
var temp_total=temp_left*1 + temp_width*1 +1;
//UPDATE THE LEFT VALUE
left=(temp_total >= left) ? temp_total : left;
left=(left <= _tasks[task_i]['def_left'] && this.remove_slack == false) ? _tasks[task_i]['def_left'] : left
_tasks[_tasks_key[task_id]]['var_left']=left;
}
else
{}}
if(left != 0)
{_tasks[task_i]['var_left']=left;
$id("task_div_"+task_id).style.marginLeft=left +"px";
}}
}};
this.move_bg=function(left, right) {var color=_tasks[_tasks_key[this.element_ids[0]]]['color'];
var bg_bar=$id("move_bg");
bg_bar.className=color;
bg_bar.style.marginLeft=left +"px";
bg_bar.style.width=(right-left) +"px";
if($id("resources_move_bg"))
{var bg2=$id("resources_move_bg");
bg2.className=color;
bg2.style.marginLeft=left +"px";
bg2.style.width=(right-left) +"px";
}
//DATES
var s=$id("mover_start");
var e=$id("mover_end");
var parent=s.parentNode;
//UPDATE POSITION
parent.style.top=(this.elements[0]['ele'].parentNode.offsetTop*1 - get_scrolltop() + this.extra_top) +"px";
parent.style.left=left+"px";
parent.style.width=(right-left)+"px";
parent.className=color;
//SET DATES
var dts=find_date($id("move_bg"), find_day_width());
s.innerHTML=clean_date(dts[0]);
e.innerHTML=clean_date(dts[1]);
}
this.update_cps=function(force) {this.moved=[];
this.move_children(null);
/*
force=force || false;
if(this.allow_cp_redraw == true && force == true && this.move_direction != "vertical")
{for(var i=0; i < this.elements.length; i++)
{reset_cp_chain(this.elements[i]['task_id']);
}}
*/
};
//THIS WILL SHOW THE VDND BACKGROUND SELECTIONS (BEFORE, AFTER, NEST)
this.line_selection=function(meta, left, right) {var ele_meta=$id("vdnd_lines_meta");
var ele_left=$id("vdnd_lines_left");
var ele_right=$id("vdnd_lines_right");
//CREATE LEFT SIDE IF NULL
if(ele_meta == null)
{//LEFT SIDE
var ele_meta=$create("DIV");
ele_meta.id="vdnd_lines_meta";
var top_line=$create("DIV");
top_line.className="top_line";
ele_meta.appendChild(top_line);
var middle_line=$create("DIV");
middle_line.className="middle_line";
ele_meta.appendChild(middle_line);
var bottom_line=$create("DIV");
bottom_line.className="bottom_line";
ele_meta.appendChild(bottom_line);
meta.appendChild(ele_meta);
}
//CREATE LEFT SIDE IF NULL
if(ele_left == null)
{//LEFT SIDE
var ele_left=$create("DIV");
ele_left.id="vdnd_lines_left";
var top_line=$create("DIV");
top_line.className="top_line";
ele_left.appendChild(top_line);
var middle_line=$create("DIV");
middle_line.className="middle_line";
ele_left.appendChild(middle_line);
var bottom_line=$create("DIV");
bottom_line.className="bottom_line";
ele_left.appendChild(bottom_line);
left.appendChild(ele_left);
}
//CREATE RIGHT SIDE IF NULL
if(ele_right == null)
{//RIGHT SIDE
var ele_right=$create("DIV");
ele_right.id="vdnd_lines_right";
var top_line=$create("DIV");
top_line.className="top_line";
ele_right.appendChild(top_line);
var middle_line=$create("DIV");
middle_line.className="middle_line";
ele_right.appendChild(middle_line);
var bottom_line=$create("DIV");
bottom_line.className="bottom_line";
ele_right.appendChild(bottom_line);
right.appendChild(ele_right);
}
//FIND WHERE WE'RE HEADED
var target_type="";
target_type=(right.id.indexOf("project") > -1) ? "project" : target_type;
target_type=(right.id.indexOf("category") > -1) ? "group" : target_type;
target_type=(right.id.indexOf("task") > -1) ? "task" : target_type;

//unhighlight all rows
if(ele_right.parentNode && ele_right.parentNode.id)
{var id1=ele_right.parentNode.id.split("_");
var len=id1.length;
var id=id1[len-1];
unhighlight_all(target_type, id);
}
//META
ele_meta.className="hidden";
ele_meta.onmouseout=function() {_multi_select.hide_vdnd_lines();
}
//LEFT
ele_left.className="hidden";
ele_left.onmouseout=function() {_multi_select.hide_vdnd_lines();
}
//RIGHT
ele_right.className="hidden";
ele_right.setAttribute("type", target_type);
ele_right.onmouseout=function() {_multi_select.hide_vdnd_lines();
}
if(target_type != "")
{//define the elements
var top=[ele_meta.childNodes[0], ele_left.childNodes[0], ele_right.childNodes[0]];
var middle=[ele_meta.childNodes[1], ele_left.childNodes[1], ele_right.childNodes[1]];
var bottom=[ele_meta.childNodes[2], ele_left.childNodes[2], ele_right.childNodes[2]];
//clear the mouse up just to be safe
for(i in top) { top[i].onmouseup=null; }
for(i in middle) { middle[i].onmouseup=null; }
for(i in bottom) { bottom[i].onmouseup=null; }
if(target_type == "task") {//clear classes
ele_meta.className="";
ele_left.className="";
ele_right.className="";
//DEFINE EVENTS
for(i in top) {top[i].onmouseover=function() { _multi_select.hover_spot("top", "task", right.getAttribute("task_id")); };
top[i].onmouseout=function() { _multi_select.hover_spot("top_out", "task", right.getAttribute("task_id")); };
top[i].onmouseup=function() { _multi_select.save_vdnd("task_line_before", right.getAttribute("task_id")); };
}
for(i in middle) {middle[i].onmouseover=function() { _multi_select.hover_spot("middle", "task", right.getAttribute("task_id")); };
middle[i].onmouseout=function() { _multi_select.hover_spot("middle_out", "task", right.getAttribute("task_id")); };
middle[i].onmouseup=function() { _multi_select.save_vdnd("task_ele", right.getAttribute("task_id")); };
}
for(i in bottom) {bottom[i].onmouseover=function() { _multi_select.hover_spot("bottom", "task", right.getAttribute("task_id")); };
bottom[i].onmouseout=function() { _multi_select.hover_spot("bottom_out", "task", right.getAttribute("task_id")); };
bottom[i].onmouseup=function() { _multi_select.save_vdnd("task_line_after", right.getAttribute("task_id")); };
}}
else if(target_type == "group") {if(right.className.indexOf("indent") > -1) {
//IF SUB GROUP
ele_meta.className="";
ele_left.className="";
ele_right.className="";
var bottom_text=(_groups[_groups_key[right.getAttribute("group_id")]]['group_hidden'] == 0) ? "group_ele" : "sub_group_line_after";
for(i in top) {top[i].onmouseover=function() { _multi_select.hover_spot("top", "group", right.getAttribute("group_id")); };
top[i].onmouseout=function() { _multi_select.hover_spot("top_out", "group", right.getAttribute("group_id")); };
top[i].onmouseup=function() { _multi_select.save_vdnd("sub_group_line_before", right.getAttribute("group_id")); };
}
for(i in middle) {middle[i].onmouseover=function() { _multi_select.hover_spot("middle", "group", right.getAttribute("group_id")); };
middle[i].onmouseout=function() { _multi_select.hover_spot("middle_out", "group", right.getAttribute("group_id")); };
middle[i].onmouseup=function() { _multi_select.save_vdnd("group_ele", right.getAttribute("group_id")); };
}
for(i in bottom) {bottom[i].onmouseover=function() { _multi_select.hover_spot("bottom", "group", right.getAttribute("group_id")); };
bottom[i].onmouseout=function() { _multi_select.hover_spot("bottom_out", "group", right.getAttribute("group_id")); };
bottom[i].onmouseup=function() { _multi_select.save_vdnd(bottom_text, right.getAttribute("group_id")); };
}}
else
{//REGULAR GROUP
if(this.move_groups.length == 0)
{//IF DRAGGING A TASK
ele_meta.className="group";
ele_left.className="group";
ele_right.className="group";
var bottom_text="group_ele";
}
else
{//IF DRAGGING A GROUP
ele_meta.className="";
ele_left.className="";
ele_right.className="";
var bottom_text=(_groups[_groups_key[right.getAttribute("group_id")]]['group_hidden'] == 0) ? "group_ele" : "group_line_after";
}
for(i in top) {top[i].onmouseover=function() { _multi_select.hover_spot("top", "group", right.getAttribute("group_id")); };
top[i].onmouseout=function() { _multi_select.hover_spot("top_out", "group", right.getAttribute("group_id")); };
top[i].onmouseup=function() { _multi_select.save_vdnd("group_line_before", right.getAttribute("group_id")); };
}
for(i in middle) {middle[i].onmouseover=function() { _multi_select.hover_spot("middle", "group", right.getAttribute("group_id")); };
middle[i].onmouseout=function() { _multi_select.hover_spot("middle_out", "group", right.getAttribute("group_id")); };
middle[i].onmouseup=function() { _multi_select.save_vdnd("group_ele", right.getAttribute("group_id")); };
}
for(i in bottom) {bottom[i].onmouseover=function() { _multi_select.hover_spot("bottom", "group", right.getAttribute("group_id")); };
bottom[i].onmouseout=function() { _multi_select.hover_spot("bottom_out", "group", right.getAttribute("group_id")); };
bottom[i].onmouseup=function() { _multi_select.save_vdnd(bottom_text, right.getAttribute("group_id")); };
}}
}
else if(target_type == "project")
{//IF DRAGGING A TASK
ele_meta.className="project";
ele_left.className="project";
ele_right.className="project";
for(i in top) {top[i].onmouseover=function() { _multi_select.hover_spot("middle", "project", right.getAttribute("project_id")); };
top[i].onmouseout=function() { _multi_select.hover_spot("top_out", "project", right.getAttribute("project_id")); };
top[i].onmouseup=function() { _multi_select.save_vdnd("project_line", right.getAttribute("project_id")); };
}}
//APPEND IT
meta.appendChild(ele_meta);
left.appendChild(ele_left);
right.appendChild(ele_right);
}};
this.hide_vdnd_lines=function() {if($id("vdnd_lines_meta")) {$id("vdnd_lines_meta").className="hidden";
}
if($id("vdnd_lines_left")) {$id("vdnd_lines_left").className="hidden";
}
if($id("vdnd_lines_right")) {$id("vdnd_lines_right").className="hidden";
}};
this.hover_spot=function(which, type, type_id) {var meta=$id("vdnd_lines_meta");
var left=$id("vdnd_lines_left");
var right=$id("vdnd_lines_right");
if(meta && left && right && meta.childNodes.length > 0 && left.childNodes.length > 0 && right.childNodes.length > 0)
{var top=[meta.childNodes[0], left.childNodes[0], right.childNodes[0]];
var middle=[meta.childNodes[1], left.childNodes[1], right.childNodes[1]];
var bottom=[meta.childNodes[2], left.childNodes[2], right.childNodes[2]];
if(which == "top")
{for(var i in top)
{top[i].className += " hover";
top[i].parentNode.childNodes[2].className=top[i].parentNode.childNodes[2].className.split(" ")[0];
}
delay_hover_off(type, type_id);
}
else if(which == "middle")
{for(var i in middle)
{middle[i].previousSibling.className=middle[i].previousSibling.className.split(" ")[0];
middle[i].nextSibling.className=middle[i].nextSibling.className.split(" ")[0];
}
highlight_row(type, type_id, "moving_highlight2");
}
else if(which == "bottom")
{for(var i in bottom)
{bottom[i].className += " hover";
bottom[i].parentNode.childNodes[0].className=bottom[i].parentNode.childNodes[0].className.split(" ")[0];
bottom[i].parentNode.childNodes[0].className=bottom[i].parentNode.childNodes[0].className.split(" ")[0];
}
delay_hover_off(type, type_id);
}
else if(which == "top_out")
{for(var i in top)
{top[i].className=top[i].className.split(" ")[0];
}}
else if(which == "bottom_out")
{for(var i in bottom)
{bottom[i].className=bottom[i].className.split(" ")[0];
}}
}}
this.save_vdnd=function(over, over_id) {
this.vdnd_last_over=this.vdnd_over;
this.vdnd_last_over_id=this.vdnd_over_id;
this.vdnd_over=over;
this.vdnd_over_id=over_id;
};
this.save_snap=function(task_id, day_width) {var ele=$id("task_div_"+task_id);
var save_string="";
if(ele)
{//MOVE THE CHILDREN TO CLEAN UP
this.moved=[];
this.move_children(task_id);
var task=_tasks[_tasks_key[task_id]];
var dates=find_date(ele, day_width);
update_position(ele, "task", dates[0], dates[1]);
save_string += task_id+":"+dates[0]+","+dates[1];
// eagerly update the days so the user can assign hours on a slow network
var task_days=Math.round(task['var_width'] / day_width);
task['days']=task_days;
//GET AND UPDATE CHILDREN
var children=task['critical_paths'];
for(var c=0; c < children.length; c++)
{if(js_in_array(children[c], this.element_ids) == -1 && js_in_array(children[c], this.saved_elements) == -1)
{var string=this.save_snap(children[c], day_width);
save_string += (save_string != "" && string != "") ? ";" : "";
save_string += string;
var len=this.saved_elements.length;
this.saved_elements[len]=children[c];
}}
}
return save_string;
}
this.save=function() {var direction=this.move_direction;
if(this.cancel_save == false)
{if(this.move_direction == "horizontal" || this.move_direction == "extend_front" || this.move_direction == "extend_back")
{//UPDATE THE CHILD TASK'S ONE LAST TIME
this.move();
var save_string="";
var day_width=find_day_width();
//UPDATE AND BUILD SAVE STRING
var save_string="";
for(var i=0; i < this.elements.length; i++)
{var string=this.save_snap(this.elements[i]['task_id'], day_width);
save_string += (save_string != "" && string != "") ? ";" : "";
save_string += string;
}
//SEND SAVE STRING
var save_array=save_string.split(";");
var save_task_string="";
for (var current_value of save_array) {save_task_string += (save_task_string == "") ? "" : ";";
save_task_string += current_value;
}
if(save_task_string != "") {          var callbackFn=new function() {            this.ref=null;
            this.task_ids=[];
            this.positions=[];
            this.drag_direction='';
            this.construct=function(ref, task_ids, positions, drag_direction) {              this.ref=ref;
              this.task_ids=task_ids;
              this.positions=positions;
              this.drag_direction=drag_direction;
            }
            this.update_ui_after_save=function() {              this.ref.reload_workloads(this.task_ids, this.positions, this.drag_direction);
            };
          };
          this.allow_cp_redraw=true;
          callbackFn.construct(this, this.element_ids, this.initial_positions, this.move_direction);
          update_task_dates(
            save_task_string,
            parseInt(this.update_hours) === 1,
            callbackFn.update_ui_after_save.bind(callbackFn)
          );
}
//TOOL TIP PREF
if(_tip_dependency_remove_slack == "" && $id("dnd_remove_slack").checked == false)
{var show_alert=false;
for(var i=0; i < this.element_ids.length; i++)
{var tsk=_tasks[_tasks_key[this.element_ids[i]]];
if(tsk && tsk['critical_paths'].length > 0)
{show_alert=true;
i=this.element_ids.length*2;
break;
}}
if(show_alert)
{var custom_message=custom_confirm("Would you like to remove any gap(slack) between dependent tasks when rescheduling? Do so by clicking <b>'Yes'</b> below, or adjust the preference in <b>Menu > My Preferences > Remove Slack when Dragging</b>");
custom_message['yes'].onclick=function() {$id("remove_slack_div").click();
_tip_dependency_remove_slack="shown";
update_preference({tip_dependency_remove_slack: 'shown'})
this.ondblclick();
};
custom_message['no'].onclick=function() {_tip_dependency_remove_slack="shown";
                update_preference({tip_dependency_remove_slack: 'shown'})
                this.ondblclick();
};
}}
track_segment_event("task scheduled");
}
else if(this.move_direction == "vertical" && this.vdnd_over != null && this.vdnd_over_id != null)
{if(this.move_groups.length == 0)
{var category="vdnd";
var what=this.vdnd_over + "|" + this.vdnd_over_id;
var task_id=this.element_ids.join(",");
//SEND THE VALUE OFF
save_value(category, what, task_id);
}
else {var category="vdnd_group";
var what=this.vdnd_over + "|" + this.vdnd_over_id;
var groups=this.move_groups.join(",");
save_value(category, what, groups);
}
$id("vdnd_block").parentNode.removeChild($id("vdnd_block"));
}
else if(this.move_direction != null)
{load_gantt();
}
//WE'RE DONE HERE
this.done();
//RESET VAR
reset_multi_select();
if (direction === 'horizontal') {track_segment_event('gantt-completed-horizontal-dnd');
} else if (direction === 'vertical') {track_segment_event('gantt-completed-vertical-dnd');
} else if(direction === 'extend_front') {track_segment_event('gantt-completed-extend-start-date-dnd');
} else if(direction === 'extend_back') {track_segment_event('gantt-completed-extend-end-date-dnd');
}}
};
this.dump=function(selection, selection_ids, delay) {if(delay > 0)
{setTimeout( function() { _multi_select.dump(selection, selection_ids, 0); }, delay);
}
else
{allow_highlight=true;
this.unhidden=[];
for(var i=0; i < selection.length; i++)
{if(selection[i]['ele'])
{var type=selection[i]['ele'].getAttribute("type");
var type_id=selection[i]['ele'].getAttribute("type_id");
//UNHIGHLIGHT ROW
$id(type+"_"+type_id).setAttribute("lock_off",0);
$id(type+"_"+type_id).removeAttribute("lock_off");
highlight_row(type, type_id, "force_off");
}

//SHOW BADGES
if(selection[i]['ele'] && selection[i]['ele'].nextSibling)
{selection[i]['ele'].nextSibling.className=trim((selection[i]['ele'].nextSibling.className).replace(/hidden/g,""));
selection[i]['ele'].nextSibling.className=trim((selection[i]['ele'].nextSibling.className).replace(/keep_arrows/g,""));
}
//UPDATE CHILDREN
var children=_tasks[_tasks_key[selection[i]['task_id']]]['critical_paths'];
for(var c=0; c < children.length; c++)
{if(js_in_array(children[c], selection_ids) == -1)
{this.unhide_stuff(children[c], selection_ids);
}}
}
unhighlight_all(null, null);
//this.clear();
this.in_action=false;
$id("cancel_clicker").className="hidden";
}};
this.unhide_stuff=function(child, selection_ids) {var div=$id("task_div_"+child);
if(div && js_in_array(child, this.unhidden) == -1) {this.unhidden.push(child);
div.nextSibling.className=trim(div.nextSibling.className.replace(/hidden/g,""));
var children_cps=_tasks[_tasks_key[child]]['critical_paths'];
for(var ch=0; ch < children_cps.length; ch++)
{if(js_in_array(children_cps[ch], selection_ids) == -1)
{this.unhide_stuff(children_cps[ch], selection_ids);
}}
}};
this.clear=function(dump) {if(this.elements.length > 0)
{//DUMP AND UNHIGHLIGHT CURRENT SELECTION
dump=dump || false;
if(dump == true) {this.dump(this.elements, this.element_ids, 0);
}
//CLEAR ELEMENTS
for(var i=0; i < this.elements.length; i++)
{var ele=$id("task_div_"+this.elements[i]['task_id']);
if(ele) {$id("task_div_"+this.elements[i]['task_id']).setAttribute("mousedown",0);
var nsib=$id("task_div_"+this.elements[i]['task_id']).nextSibling;
if(nsib) {nsib.className=nsib.className.replace(/keep_arrows/g,"");
}}
}
for(var i=0; i < this.move_groups.length; i++)
{if($id("category_div_"+this.move_groups[i]) && $id("category_div_"+this.move_groups[i]).nextSibling) {$id("category_div_"+this.move_groups[i]).nextSibling.className=($id("category_div_"+this.move_groups[i]).nextSibling.className).replace(/hidden/g,"");
}}
unhighlight_all(null, null);
}
this.elements=[];
this.element_ids=[];
this.cancel_control(false);
this.already_hidden=[];
this.move_groups=[];
this.move_projects=[];
this.vdnd_from="right";
this.vdnd_over="";
this.vdnd_over_id="";
this.saved_elements=[];
this.update_hours=0;
this.initial_positions=null;
if($id("vdnd_block")) {$id("vdnd_block").parentNode.removeChild($id("vdnd_block"));
}
if($id("move_bg")) {$id("move_bg").className="hidden";
$id("move_dates").className="hidden";
}
if($id("resources_move_bg")) {$id("resources_move_bg").className="hidden";
}};
this.done=function(reset_elements) {this.dump(this.elements, this.element_ids, 100);
this.adjust_selection(false);
allow_hover=true;
this.clear();
this.elements=[];
this.element_ids=[];
this.cancel_control(false);
this.move_count=0;
this.already_hidden=[];
//CLEAR MOVE TYPES
this.move_type=null;
this.move_direction=null;
this.in_selection=false;
this.saved_elements=[];
this.update_hours=0;
//CLEAR MOUSE VARIABLES
this.start_x=null;
this.start_y=null;
_dnd_x=null;
_dnd_y=null;
_dnd_moves=0;
_task_reschedule=null;
//CLEAR TIMEOUT
clearTimeout(_to1);
clearTimeout(_to2);
//CLEAR DOCUMENT EVENTS
document.onmousemove=null;
document.onmouseup=null;
//LOAD NEXT TOOL TIP
if(_tooltip_step == "resize" && _tooltip_progress == 1 && _show_tooltips < 2) {close_tooltip("resize");
display_tooltip("resize","","");
}
else if(_tooltip_step == "resize" && _tooltip_progress == 2 && _show_tooltips < 2) {load_next_tooltip();
}
else if(_tooltip_step == "resources" && _tooltip_progress == 1 && _show_tooltips < 2) {close_tooltip("resources");
display_tooltip("resources","","");
}};
  /**
   * Sets the initial positions of the tasks before they start moving.
   *
   * @param {*} task_ids all the tasks being moved
   *
   * @returns {void}
   */
  this.set_initial_task_positions=function (task_ids) {    if (this.initial_positions !== null) {      return;
    }
    var all_task_ids=this.get_all_moved_tasks(this.element_ids);
    this.initial_positions=this.get_all_tasks_range(all_task_ids);
  };
  /**
   * Based on the tasks that are being rescheduled, refreshes only that part of the workloads view.
   *
   * @param {int[]} task_ids The selected tasks being moved.
   *
   * @returns {void}
   */
  this.reload_workloads=function (task_ids, positions, move_direction) {    var is_horizontal_drag=move_direction === 'horizontal'
      || move_direction === 'extend_front'
      || move_direction === 'extend_back';
    if (_resource_view !== "open" || !is_horizontal_drag) {      return;
    }
    var all_task_ids=this.get_all_moved_tasks(task_ids);
    var new_date_range=this.get_all_tasks_range(all_task_ids);
    var date_range=this.find_date_range(positions, new_date_range);
    load_resource_schedule(date_range.start_date, date_range.end_date);
  };
  /**
   * Finds all of the tasks being moved. Starting with the selected tasks and concat'ing in their dependent tasks.
   *
   * @param {int[]} task_ids
   *
   * @returns {int[]}
   */
  this.get_all_moved_tasks=function (task_ids) {    var all_tasks_ids=task_ids;
    task_ids.forEach(function (task_id) {      var children=this.get_task_children(task_id);
      all_tasks_ids=all_tasks_ids.concat(children);
    }.bind(this));
    var distinctFn=(value, index, self) => {      return self.indexOf(value) === index;
    }
    return all_tasks_ids.filter(distinctFn);
  };
  /**
   * For a specified task, returns all of its dependent tasks.
   *
   * @param {int} task_id
   * @returns {int[]}
   */
  this.get_task_children=function (task_id) {var task=_tasks[_tasks_key[task_id]];
if (!task) {return [];
}
    var children=task['critical_paths'];
    if (children.length === 0) {      return [];
    }
    var all_task_ids=[];
    children.forEach(function (child_task_id) {      all_task_ids.push(child_task_id);
      all_task_ids=all_task_ids.concat(this.get_task_children(child_task_id));
    }.bind(this));
    return all_task_ids;
  };
  /**
   * Based off of the supplied tasks, returns their min and max left/right positions as well as min/max start/end date.
   *
   * @param {int[]} task_ids
   */
  this.get_all_tasks_range=function (task_ids) {    var min_left=null;
    var max_right=null;
    task_ids.forEach(function (task_id) {      var task=_tasks[_tasks_key[task_id]];
      if (!task) {        return;
      }
      var left=parseInt(task['var_left']);
      var right=left + task['var_width'];
      if (left < min_left || min_left === null) {        min_left=left;
      }
      if (right > max_right) {        max_right=right;
      }
    });
    return {      min_left: min_left,
      max_right: max_right,
      start_date: find_date(min_left, find_day_width()),
      end_date: find_date(max_right, find_day_width()),
    };
  };
  /**
   * Based off of the supplied data, returns the min and max start_date/end_date
   *
   * @param {object} initial_positions
   * @param {object} new_positions
   *
   * @returns {object}
   */
  this.find_date_range=function (initial_positions, new_positions) {    return {      start_date: initial_positions.min_left < new_positions.min_left ? initial_positions.start_date : new_positions.start_date,
      end_date: initial_positions.max_right > new_positions.max_right ? initial_positions.end_date : new_positions.end_date,
    }
  };
this.cancel=function() {this.cancel_save=true;
//CLEAR DOCUMENT EVENTS
document.onmousemove=null;
document.onmouseup=null;
//CLEAR TIMEOUT
clearTimeout(_to1);
this.clear(true);
this.done(false);
setTimeout(load_gantt, 10);
track_segment_event('gantt-canceled-dnd');
};
this.run_reset=function() {this.done("false");
this.clear(true);
};
};
_multi_select=_multi_select_default;
function reset_multi_select() {delete _multi_select;
_multi_select=_multi_select_default;
/*
setTimeout(function() {//UPDATE GROUP BARS
//update_group_bar();
//REFRESH CPS
//load_critical_paths();
}, 100);
*/
}
function kill_move() {if(_dnd_moves > 0) {_multi_select.move();
/* HOURS */
var check_hours=false;
var factor_hours=false;
var check_hours_on=[];
if(_multi_select.move_direction == "extend_back" || _multi_select.move_direction == "extend_front")
{for(p in _projects)
{if(_projects[p]['project_enable_hours'] == 1) {check_hours=true;
}}
if(check_hours == true)
{for(var i in _multi_select.element_ids)
{var project_id=_tasks[_tasks_key[_multi_select.element_ids[i]]]['project_id'];
if(_projects[_projects_key[project_id]]['project_enable_hours'] == 1) {factor_hours=true;
check_hours_on.push(_multi_select.element_ids[i]);
}}
}}
/* END HOURS */
if(factor_hours == true)
{//CONFIRMATION POPUP
_multi_select.in_action=false;
var direction=_multi_select.move_direction;
var start_x=_multi_select.start_x;
var message_type="";
if(direction == "extend_back" && _dnd_x > start_x) {message_type="longer";
}
else if(direction == "extend_back" && _dnd_x < start_x) {message_type="shorter";
}
else if(direction == "extend_front" && _dnd_x > start_x) {message_type="shorter";
}
else if(direction == "extend_front" && _dnd_x < start_x) {message_type="longer";
}
if(message_type == "")
{//SAME SIZE - JUST SAVE AWAY
_multi_select.save();
}
else
{document.onmouseup=null;
var auto_pref=$id("auto_hour_scheduling").value;
if(message_type == "shorter" || message_type == "longer")
{//CHECK IF RESOURCES ARE ASSIGNED - if none - skip hours adjustments
var skip=true;
for(e in _multi_select.element_ids)
{var task=_tasks[_tasks_key[_multi_select.element_ids[e]]];
var user_resources=task['user_resources'];
var company_resources=task['company_resources'];
var custom_resources=task['custom_resources'];
var resource_length=0;
for(var r in user_resources) {if(user_resources[r]['resource_id'] != "") {skip=false;
}}
for(var r in company_resources) {if(company_resources[r]['resource_id'] != "") {skip=false;
}}
for(var r in custom_resources) {if(custom_resources[r]['resource_id'] != "") {skip=false;
}}
}
//IF MOVING ONE TASK AND NO HOURS ASSOCIATED
if(_multi_select.element_ids.length == 1 && _tasks[_tasks_key[_multi_select.element_ids[0]]]['estimated_hours'] == 0)
{skip=true;
}
if(skip)
{_multi_select.update_hours=0;
_multi_select.save();
}
else if(auto_pref == "adjust_hours")
{_multi_select.update_hours=1;
_multi_select.save();
}
else if(auto_pref == "leave_hours")
{_multi_select.update_hours=0;
_multi_select.save();
}
else
{var increase_decrease=(message_type == "shorter") ? "decrease" : "increase";
var conf_text=(_multi_select.element_ids.length == 1) ? hours_conf_popup_text(_multi_select.element_ids[0]) : "Would you also like to <b>"+increase_decrease+" the total number of hours assigned</b> to each person/resource on these tasks?";
hours_confirm_popup(
conf_text,
function() {_multi_select.update_hours=1;
_multi_select.save();
},
function() {_multi_select.update_hours=0;
_multi_select.save();
}
);
}}
}}
else
{//NO NEED FOR A POPUP - JUST A SAVE
_multi_select.save();
}}
else if(_is_shift == false && _command == false) {_multi_select.clear(true);
_multi_select.done();
}}
// JavaScript Document
var BASELINES=null;
var BASELINE_TASKS={};
function get_selected_baselines() {  return $id('selected_baselines').value.split(',') || [];
}
function baseline_list() {  var project_ids=$id('project_ids').value.split(',') || [];
  var counter=0;
  var baseline_list=[];
  project_ids.map(function (project_id) {    new $ajax({      type: 'GET',
      url: API_URL + 'v1/projects/' + project_id + '/baselines',
      response: function (data) {        counter++;
        var json=JSON.parse(data.response);
        json.map(function (baseline) {          baseline_list.push(baseline);
        });
        BASELINES=baseline_list;
        if (counter === project_ids.length) {          display_baseline_list(baseline_list);
        }
      },
    });
  });
}
function format_baseline_name(name) {  // 2020-01-01 12:00:00 (current format)
  var new_format_check=new Date(name + 'Z');
  if (!isNaN(new_format_check)) {    return format_dated_baseline_name(new_format_check);
  }
  // 20200101120000 format (legacy format)
  var old_format_check=new Date(
    Date.UTC(
      name.substring(0, 4),
      name.substring(4, 6) - 1,
      name.substring(6, 8),
      name.substring(8, 10),
      name.substring(10, 12),
      name.substring(12, 14)
    )
  );
  if (!isNaN(old_format_check)) {    return format_dated_baseline_name(old_format_check);
  }
  // name is not a date
  return name;
}
function format_dated_baseline_name(date_object) {  var string=dateFormat(date_object, 'default');
  return pretty_date(string, 'no') + ' ' + pretty_time(string);
}
function display_baseline_list(baseline_list) {  const target=$id('baseline_options');
  remove_child_nodes(target);
  baseline_list
    .sort(function (a, b) {      const aDate=new Date(a.created_at);
      const bDate=new Date(b.created_at);
      return aDate > bDate ? -1 : 1;
    })
    .forEach(function (baseline) {      // At the moment only name is updated, so this is a valid way to see if name has changed
      const wasUpdated=baseline.created_at !== baseline.updated_at;
      const name=wasUpdated
        ? baseline.name
        : format_baseline_name(baseline.name);
      display_baseline_list_item(Object.assign({}, baseline, {name}));
    });
}
function display_baseline_list_item(baseline) {  var target=$id('baseline_options');
  target.style.display='grid';
  var selected_baselines=get_selected_baselines();
  var is_baseline_selected=js_in_array(baseline.id, selected_baselines) > -1;
  var parent_div=$create('DIV');
  var checkbox_div=$create('DIV');
  var baseline_name_div=$create('SPAN');
  var baseline_edit_input=$create('INPUT');
  parent_div.style.position='relative';
  parent_div.className='option option_small';
  parent_div.style.paddingLeft=0;
  parent_div.style.display='inline-flex';
  parent_div.style.alignItems='center';
  parent_div.style.minHeight='16px';
  checkbox_div.className='checkbox';
  checkbox_div.className += is_baseline_selected ? ' checked' : '';
  checkbox_div.style.minHeight='8px';
  checkbox_div.setAttribute('baseline_id', baseline.id);
  checkbox_div.onclick=function () {    manage_check(this, null);
    select_baseline(this.getAttribute('baseline_id'));
  };
  baseline_name_div.className='baseline_name';
  baseline_name_div.setAttribute('baseline_id', baseline.id);
  baseline_name_div.style.maxWidth='136px';
  baseline_name_div.style.overflowWrap='anywhere';
  baseline_name_div.appendChild($text(baseline.name));
  baseline_edit_input.className='baseline_edit';
  baseline_edit_input.setAttribute('baseline_id', baseline.id);
  baseline_edit_input.style.display='none';
  parent_div.appendChild(checkbox_div);
  parent_div.appendChild(baseline_name_div);
  parent_div.appendChild(baseline_edit_input);
  var project_id=baseline.project_id;
  var can_delete =
    _projects[_projects_key[project_id]]['project_permission'] === 'admin';
  if (can_delete) {    var q_edit=$create('DIV');
    q_edit.className='baseline_edit badge_block';
    q_edit.setAttribute('baseline_id', baseline.id);
    q_edit.style.marginLeft='auto';
    q_edit.style.height='16px';
    q_edit.style.width='16px';
    q_edit.style.display='none';
    q_edit.onclick=function () {      let shouldUpdate=true;
      const baseline_id=this.getAttribute('baseline_id');
      baseline_name_div=target.querySelector(
        "span[baseline_id='" + baseline_id + "']"
      );
      baseline_edit_input=target.querySelector(
        "input[baseline_id='" + baseline_id + "']"
      );
      const update_baseline=function (name_div, edit_input) {        const new_name=edit_input.value;
        name_div.removeChild(name_div.firstChild);
        name_div.appendChild($text(new_name));
        name_div.style.display='unset';
        edit_input.style.display='none';
        update_any_target('baselines', baseline_id, {name: new_name});
        track_segment_event('baseline-edited');
      };
      baseline_edit_input.onblur=function () {        if (shouldUpdate) {          update_baseline(baseline_name_div, baseline_edit_input);
        }
      };
      baseline_edit_input.onkeydown=function (e) {        if (e.key === 'Enter') {          if (shouldUpdate) {            update_baseline(baseline_name_div, baseline_edit_input);
          }
        }
        if (e.key === 'Escape') {          shouldUpdate=false;
          baseline_name_div.style.display='unset';
          baseline_edit_input.style.display='none';
          baseline_edit_input.setAttribute('value', '');
        }
      };
      baseline_name_div.style.display='none';
      baseline_edit_input.style.display='unset';
      baseline_edit_input.setAttribute('value', baseline.name);
      baseline_edit_input.select();
    };
    var icon=$create('I');
    icon.className='tg-icon ' + 'edit-pencil';
    icon.style.paddingTop='3px';
    q_edit.appendChild(icon);
    parent_div.appendChild(q_edit);
    var q_delete=$create('DIV');
    q_delete.className='baseline_delete badge_block';
    q_delete.style.display='none';
    q_delete.style.height='16px';
    q_delete.style.width='16px';
    q_delete.setAttribute('baseline_id', baseline.id);
    q_delete.onclick=function () {      var conf=custom_confirm(
        'Are you sure you want to delete baseline ' + baseline.name + '?'
      );
      conf['yes'].setAttribute('baseline_id', this.getAttribute('baseline_id'));
      conf['yes'].onclick=function () {        this.ondblclick();
        force_unselect_baseline(this.getAttribute('baseline_id'));
        delete_baseline(this.getAttribute('baseline_id'));
        track_segment_event('gantt-deleted-a-baseline');
      };
    };
    var delete_icon=$create('I');
    delete_icon.className='tg-icon ' + 'trash';
    delete_icon.style.paddingTop='3px';
    q_delete.appendChild(delete_icon);
    parent_div.appendChild(q_delete);
    parent_div.onmouseover=function () {      q_edit.style.display='unset';
      q_delete.style.display='unset';
    };
    parent_div.onmouseout=function () {      q_edit.style.display='none';
      q_delete.style.display='none';
    };
  }
  target.appendChild(parent_div);
}
function create_baselines() {  var project_ids=$id('project_ids').value.split(',') || [];
  var counter=0;
  project_ids.map(function (project_id) {    new $ajax({      type: 'POST',
      url: API_URL + 'v1/projects/' + project_id + '/baselines',
      data: {},
      response: function (data) {        counter++;
        // Company plan does not support baselines
        if (data.status === 402) {          baselines_upgrade_alert(project_id);
        }
        if (counter === project_ids.length) {          baseline_list();
        }
        track_segment_event('gantt-created-a-baseline');
      },
    });
  });
}
function baselines_upgrade_alert(project_id) {  var company_id=_projects[_projects_key[project_id]]['company_id'] || null;
  if (company_id !== null) {    open_go_premium('baselines', company_id);
    return;
  }
  // otherwise show the alert that tells them to purchase
  new $ajax({    type: 'GET',
    url: API_URL + 'v1/companies/' + company_id,
    response: function (data) {      var json=JSON.parse(data.response);
      var is_account_holder=json.current_user_permissions === 'admin';
      var account_holders=json.account_holders;
      var details=baseline_alert_details(is_account_holder, account_holders);
      var alert=newAppAlert(details.title, details.body, details.button_text);
      if (alert.button !== null) {        alert.button.onclick=function () {          window.location =
            NEW_APP_URL + 'admin/companies/' + company_id + '/subscription';
        };
      }
    },
  });
}
function baseline_alert_details(is_account_holder, account_holders) {  if (is_account_holder) {    return {      title:
        'Sorry, baselines are not available in your subscription. Upgrade your subscription to start using baselines.',
      body: null,
      button_text: 'Upgrade Plan',
    };
  }
  if (typeof account_holders === 'object') {    body =
      '<div><b>To manage your subscription, contact an account holder:</b></div>';
    body +=
      '<div style="background: #F5F7F9; padding: 4px 10px; margin-top: 15px;">';
    body += '<ul>';
    for (var i=0; i < account_holders.length && i < 4; i++) {      var user=account_holders[i];
      body +=
        '<li style="padding: 6px 0;">' +
        user.first_name +
        ' ' +
        user.last_name +
        ' - ' +
        user.email_address +
        '</li>';
    }
    body += '</ul>';
    body += '</div>';
  }
  return {    title:
      'Sorry, baselines are not available for your company. Contact an account holder below and request an upgrade to your subscription.',
    body: body,
    button_text: null,
  };
}
function display_selected_baselines() {  clear_baselines();
  // Baselines aren't loaded yet - give them a second an try again
  if (BASELINES === null) {    baseline_list();
    setTimeout(function () {      display_selected_baselines();
    }, 1000);
    return;
  }
  fetch_selected_baseline_tasks();
  track_segment_event('gantt-displayed-baseline-on-gantt');
}
function fetch_selected_baseline_tasks() {  var baseline_ids=get_selected_baselines();
  var baseline_ids_to_fetch=baseline_ids.filter(function (baseline_id) {    return baseline_id !== '' && !BASELINE_TASKS[baseline_id];
  });
  var counter=baseline_ids_to_fetch.length;
  if (counter === 0) {    render_selected_baselines();
    return;
  }
  baseline_ids_to_fetch.forEach(function (baseline_id) {    $ajax({      type: 'GET',
      url: API_URL + 'v1/baselines/' + baseline_id + '/tasks',
      response: function (data) {        counter--;
        var json=JSON.parse(data.response);
        BASELINE_TASKS[baseline_id]=json;
        if (counter === 0) {          render_selected_baselines();
        }
      },
    });
  });
}
function render_selected_baselines() {  var count=0;
  get_selected_baselines().forEach(function (baseline_id) {    if (baseline_id === '') {      return;
    }
    display_selected_baseline_tasks(BASELINE_TASKS[baseline_id], count);
    count++;
  });
}
function display_selected_baseline_tasks(tasks, count) {  var day_width=find_day_width();
  tasks.map(function (task) {    var parent=$id('task_' + task.task_id);
    if (!parent) {      return;
    }
    var pos=find_position(task.start_date, task.end_date, day_width);
    if (pos[0] === 0 || pos[1] === 0) {      return;
    }
    // take the space the task border used to take
    pos[1]=pos[1] + 2;
    var div=$create('DIV');
    div.className='task_in_chart baseline radius baseline';
    div.className += (count % 3) * 1 + 1;
    div.id='baseline_' + count + '_' + task.task_id;
    div.style.marginLeft=pos[0] + 'px';
    div.style.width=pos[1] + 'px';
    parent.appendChild(div);
  });
}
function delete_baseline(baseline_id) {  new $ajax({    type: 'DELETE',
    url: API_URL + 'v1/baselines/' + baseline_id,
  });
}
function select_baseline(id) {  var value=$id('selected_baselines').value;
  var val=value.split(',');
  var is_in=js_in_array(id, val);
  if (is_in == -1) {    value += value == '' ? '' : ',';
    value += id;
    $id('selected_baselines').value=value;
  } else {    val.splice(is_in, 1);
    $id('selected_baselines').value=val.join(',');
  }
  display_selected_baselines();
}
function force_unselect_baseline(id) {  var value=$id('selected_baselines').value;
  var val=value.split(',');
  var is_in=js_in_array(id, val);
  if (is_in != -1) {    val.splice(is_in, 1);
    $id('selected_baselines').value=val.join(',');
  }
  display_selected_baselines();
}
function clear_baselines() {  var all_divs=$id('tasks').getElementsByTagName('DIV');
  for (var i=all_divs.length - 1; i >= 0; i--) {    if (all_divs[i].className.indexOf('baseline') > -1) {      all_divs[i].parentNode.removeChild(all_divs[i]);
    }
  }}
// JavaScript Document
function load_involved() {  if (!$id("open_projects")) {    return;
  }
  new $ajax({    parent: this,
    type: 'GET',
    url: API_URL + 'v1/projects/all?fields=id,company_id,name,status',
    response: function (data) {      if (data.status !== 200) {        return;
      }
      var response=JSON.parse(data.responseText);
      var target=$id("projects_list");
      remove_child_nodes(target);
      var opts=new Array();
      opts[0]=[
        "Active Projects",
        "current_projects current_bubble",
        "Active"
      ];
      opts[1]=[
        "On Hold",
        "on_hold_projects on_hold_bubble",
        "On Hold"
      ];
      opts[2]=[
        "Completed",
        "completed_projects completed_bubble",
        "Complete"
      ];
      var warning=$create("DIV");
      warning.className="option";
      var w2=$create("SPAN");
      w2.appendChild($text("The order you select is the order they will appear."));
      warning.appendChild(w2);
      target.appendChild(warning);
      for (var o=0; o < opts.length; o++) {        var wrapper=$create("DIV");
        var title=$create("DIV");
        title.appendChild($text(opts[o][0]));
        title.className="option_title";
        target.appendChild(title);
        var filtered_status=opts[o][2];
        var filtered_projects=response.projects.filter(function (project) {          return project.status === filtered_status;
        });
        filtered_projects.map(function (project) {          var ID=project.id;
          var PROJECT_NAME=project.name;
          var div=$create("DIV");
          div.className="option option2 option_small";
          var label=$create("LABEL");
          label.setAttribute("for", "project_checkbox_" + ID);
          var input=$create("INPUT");
          input.type="checkbox";
          input.id="project_checkbox_" + ID;
          input.setAttribute("project_id", ID);
          input.onchange=function () {            change_project_selection(this.getAttribute("project_id"));
          };
          var is_checked=(_projects_key[ID] >= 0) ? true : false;
          input.checked=is_checked;
          label.appendChild(input);
          label.appendChild($text(" " + PROJECT_NAME));
          div.appendChild(label);
          wrapper.appendChild(div);
          target.appendChild(wrapper);
        });
        // no need for select all if there is only one or less projects.
        if (filtered_projects.length >= 2) {          var check_all=$create("DIV");
          check_all.className="option option2 option_small";
          check_all.style.textDecoration="underline";
          check_all.appendChild($text("select all"));
          check_all.onclick=function () {            var inputs=this.parentNode.getElementsByTagName("INPUT");
            for (var i=0; i < inputs.length; i++) {              if (this.firstChild.nodeValue == "select all") {                if (inputs[i].checked == false) {                  inputs[i].checked=true;
                  change_project_selection(inputs[i].getAttribute("project_id"))
                }
              }
              else {                if (inputs[i].checked == true) {                  inputs[i].checked=false;
                  change_project_selection(inputs[i].getAttribute("project_id"))
                }
              }
            }
            if (this.firstChild.nodeValue == "select all") {              this.firstChild.nodeValue="unselect all";
            }
            else {              this.firstChild.nodeValue="select all"
            };
          };
          wrapper.appendChild(check_all);
          target.appendChild(wrapper);
        }
      }
    }
  });
}
function load_selected_projects() {  var project_ids=$id("project_ids").value;
  var hashIds=HashSearch.get('ids');
  if (project_ids === '') {    alert("Oops! You need at least one project selected to view this screen.");
    $id("project_ids").value=hashIds;
  } else if (project_ids !== hashIds) {    load_gantt();
  }}
function change_project_selection(id) {  var orig_val=$id("project_ids").value;
  var val=orig_val;
  var orig=orig_val.split(",");
  if (js_in_array(id, orig) == -1) {    val += (val != "") ? "," : "";
    val += id;
    $id("project_ids").value=val;
  }
  else {    var val="";
    for (var i=0; i < orig.length; i++) {      if (orig[i] != id) {        val += (val != "") ? "," : "";
        val += orig[i];
      }
    }
    $id("project_ids").value=val;
  }}// JavaScript Document
_reopen_badge=null;
_reopen_badge_details=[];
////// DROPDOWN DIVS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_badge_dd(
  which,
  type,
  type_id,
  parent_element,
  in_edit_window
) {  var select_id=[];
  select_id['resources']=[type + '_choose_resource_' + type_id, ''];
  select_id['color']=[type + '_choose_color_' + type_id, 'task_color_dd'];
  select_id['dependency_front']=[
    'dependency_front_' + type_id,
    'dependency_dd_back',
  ];
  select_id['dependency_back']=[
    'dependency_back_' + type_id,
    'dependency_dd_back',
  ];
  //CREATE DIV
  var badge_dd=$create('DIV');
  badge_dd.id=select_id[which][0];
  badge_dd.className='badge_dropdown ' + select_id[which][1];
  badge_dd.setAttribute('mouse_over', 0);
  badge_dd.setAttribute('type', type);
  badge_dd.setAttribute('type_id', type_id);
  badge_dd.onmouseover=function () {    this.setAttribute('mouse_over', 1);
  };
  badge_dd.onmouseout=function () {    this.setAttribute('mouse_over', 0);
    check_close_badge_dd(this.id, 500);
  };
  //GET INNER CONTENT
  if (which == 'color') {    badge_dd.appendChild(open_color_checker(type, type_id));
  } else if (which == 'resources') {    badge_dd.appendChild(display_task_resource(type_id));
  } else if (which == 'dependency_front' || which == 'dependency_back') {    badge_dd.appendChild(display_dependency_dd(type_id));
  }
  //DIV PLACEMENT
  if (in_edit_window != true) {    if (_version == 'gantt_chart') {      var type1=type == 'group' ? 'category' : type;
      var location_ele=$id(type1 + '_div_' + type_id);
      var top=location_ele.parentNode.offsetTop * 1;
      top += location_ele.offsetHeight * 1 + 5;
      top += $id('inner_list_wrapper').offsetTop;
      var left=parent_element.parentNode.parentNode.offsetLeft;
      left += parent_element.offsetLeft;
      left += parent_element.offsetWidth / 2;
      badge_dd.style.top=top + 'px';
      badge_dd.style.left=left + 'px';
      //APPEND
      $id('utility_box').appendChild(badge_dd);
      var clear=$create('DIV');
      clear.className='clear';
      badge_dd.appendChild(clear);
      //CHECK FOR OVERFLOW
      var top=badge_dd.offsetTop;
      var left=badge_dd.offsetLeft;
      var width=badge_dd.offsetWidth;
      var height=badge_dd.offsetHeight;
      //FIND USABLE AREA
      var scroll_content=$id('tasks');
      var sleft=scroll_content.scrollLeft;
      var swidth=scroll_content.offsetWidth;
      //ADJUST X
      if (left - width / 2 < sleft) {        badge_dd.style.left=sleft + 2 + 'px';
        badge_dd.className += ' x_correction';
      } else if (left * 1 + width > sleft * 1 + swidth) {        badge_dd.style.left=sleft * 1 + swidth - width - 2 + 'px';
        badge_dd.className += ' x_correction';
      } else {        //fits perfectly - no correction needed
      }
      //ADJUST Y
      var s_top=$id('background_lines').offsetTop * 1 + 25;
      var s_bottom=$id('scroll_container').getAttribute('from_top') * 1 - 55;
      var max_height=s_bottom - s_top;
      if (height > max_height) {        badge_dd.style.top=s_top + 'px';
        badge_dd.style.maxHeight=max_height + 'px';
        badge_dd.style.height=max_height + 'px';
        top=badge_dd.offsetTop; //reset top variabel
        height=badge_dd.offsetHeight; //reset height variable
      } else if (top * 1 + height > s_bottom) {        badge_dd.style.top=s_bottom - height - 5 + 'px';
        badge_dd.style.height=height + 'px';
      } else {        //fits perfectly - no correction needed
        badge_dd.style.maxHeight=height + 'px';
        badge_dd.style.height=height + 'px';
      }
    } else if (_version == 'list_view') {      var pos=real_position(parent_element);
      pos.x += parent_element.offsetWidth;
      badge_dd.style.top=pos.y + 'px';
      badge_dd.style.left=pos.x + 'px';
      var clear=$create('DIV');
      clear.className='clear';
      badge_dd.appendChild(clear);
      document.body.appendChild(badge_dd);
      badge_dd.style.height=badge_dd.offsetHeight + 'px';
      //MOVE IF NEEDED
      var sizes=page_sizes();
      var page_height=sizes[1] * 1 + window.scrollY;
      var diff =
        badge_dd.offsetTop * 1 + badge_dd.offsetHeight * 1 - page_height + 10;
      if (diff > 0) {        badge_dd.style.marginTop='-' + diff + 'px';
      }
    }
    if (which == 'resources') {      var close_div=$create('DIV');
      close_div.appendChild($text('press the esc key to close'));
      close_div.className='resource_close_button';
      close_div.setAttribute('type', type);
      close_div.setAttribute('type_id', type_id);
      close_div.id='resource_assign_close_button';
      close_div.onclick=function () {        clear_utility_box();
        display_resource_view('nosave');
        var force_close=$id(
          this.getAttribute('type') +
            '_choose_resource_' +
            this.getAttribute('type_id')
        );
        if (force_close) {          force_close.parentNode.removeChild(force_close);
        }
      };
      badge_dd.appendChild(close_div);
    }
  }
  badge_dd.className += ' extra_classes';
  highlight_row(type, type_id, 'hover_on');
  allow_hover=false;
  document.body.style.overflow='hidden';
  if (which == 'resources') {    badge_dd.getElementsByTagName('INPUT')[0].focus();
  }
  if (in_edit_window == false) {    var bg=build_background_cover();
    bg.setAttribute('type', type);
    bg.setAttribute('type_id', type_id);
    if (which == 'resources') {      bg.onclick=function () {        hide_backdrop();
        clear_utility_box();
        display_resource_view('nosave');
        var force_close=$id(
          this.getAttribute('type') +
            '_choose_resource_' +
            this.getAttribute('type_id')
        );
        if (force_close) {          force_close.parentNode.removeChild(force_close);
        }
      };
    } else {      bg.onclick=function () {        hide_backdrop();
        clear_utility_box();
      };
    }
    document.body.className += ' special_hide';
    if (which == 'color') {      bg.style.background='none';
    }
  }
  if (in_edit_window == true) {    badge_dd.className='floating_edit_resources';
    return badge_dd;
  }
  if (which == 'dependency_back' || which == 'dependency_front') {    var left=$id('task_div_' + type_id).offsetLeft * 1;
    var width =
      which == 'dependency_back'
        ? $id('task_div_' + type_id).offsetWidth * 1
        : 0;
    badge_dd.style.left=left + width + 'px';
    var scroll_content=$id('tasks');
    var far_right=badge_dd.offsetLeft * 1 + badge_dd.offsetWidth * 1;
    var edge_right=scroll_content.scrollLeft * 1 + scroll_content.offsetWidth;
    var right_overlap=edge_right - far_right - 10;
    if (right_overlap < 0) {      badge_dd.style.left=left + width + right_overlap + 'px';
    }
  }
  //CLEAR TOOL TIP IF NEEDED
  if (
    which == 'resources' &&
    _tooltip_step == 'resources' &&
    _tooltip_progress == 1
  ) {    close_tooltip('resources');
    _tooltip_progress=2;
    document.body.className += ' special_hide';
  }}
function check_close_badge_dd(ele, delay) {  if (delay > 0) {    setTimeout(function () {      check_close_badge_dd(ele, -1);
    }, delay);
  } else {    ele=$id(ele);
    if (ele == null || ele == 'undefined') {      //do nothing
    } else if (
      ele.id == 'edit_window_edit_resources' &&
      ele.getAttribute('mouse_over') == 0 &&
      ele.getAttribute('keep') != 1
    ) {      clear_utility_box();
    } else if (
      ele.id == 'people_assigned_column_edit_resources' &&
      ele.getAttribute('mouse_over') == 0 &&
      ele.getAttribute('keep') != 1
    ) {      allow_hover=true;
      unhighlight_all();
      clear_utility_box();
      ele.parentNode.removeChild(ele);
      display_resource_view('nosave');
    }
  }}
////// RESOURCES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var _search_results_run=null;
var _search_selected=0;
var _search_length=0;
function display_task_resource(task_id) {  if (_version == 'gantt_chart') {    $id('task_' + task_id).removeAttribute('dont_clear');
  }
  //container
  var div=$create('DIV');
  div.className='task_resources_dd';
  div.setAttribute('task_id', task_id);
  div.id='task_choose_resource_' + task_id;
  //search box
  var search_box=$create('DIV');
  search_box.className='resource_search';
  var search_input=$create('INPUT');
  search_input.type='text';
  search_input.setAttribute('task_id', task_id);
  search_input.setAttribute('placeholder', 'Search People or Labels');
  search_input.onfocus=function () {    this.parentNode.parentNode.parentNode.setAttribute('keep', 1);
  };
  search_input.onblur=function () {    if (
      this.parentNode.parentNode.parentNode.id !=
      'people_assigned_column_edit_resources'
    ) {      this.parentNode.parentNode.parentNode.setAttribute('keep', 0);
      check_close_badge_dd(this.parentNode.parentNode.parentNode.id, 250);
    }
  };
  search_input.onkeydown=function (event) {    key_code=event.keyCode;
    if (key_code == _master_keys['esc'] || key_code == _master_keys['tab']) {      //esc (close)
      hide_backdrop();
      clear_utility_box();
      display_resource_view('nosave');
      var force_close=$id(
        'task_choose_resource_' + this.getAttribute('task_id')
      );
      if (force_close) {        force_close.parentNode.removeChild(force_close);
      }
      if (key_code == _master_keys['tab']) {        if (_version == 'list') {          if (_is_shift) {            arrow_tab(
              'previous',
              $id('task_resources_list_' + this.getAttribute('task_id'))
                .parentNode
            );
          } else {            arrow_tab(
              'next',
              $id('task_resources_list_' + this.getAttribute('task_id'))
                .parentNode
            );
          }
        } else if (_version == 'gantt_chart') {          var task_id=this.getAttribute('task_id');
          if ($id('people_assigned_column_edit_resources')) {            click_selected_field(
              select_field(
                this.getAttribute('task_id'),
                $id('task_assigned_resources_' + this.getAttribute('task_id'))
              )
            );
          }
        }
      }
      var ele=$id('people_assigned_column_edit_resources');
      if (ele) {        ele.parentNode.removeChild(ele);
      }
      return false;
    }
  };
  search_input.onkeyup=function (event) {    e=event;
    var key_code=e != null ? e.keyCode : 12983; // else is random number to force the resize
    this.className=this.value == '' ? '' : 'no_bg';
    if (key_code == _master_keys['down']) {      //down (next)
      if (_search_length - 1 > _search_selected) {        _search_selected++;
        var li=$id('li_' + _search_selected);
        clear_selected_search(li);
        li.className='selected';
      }
      return false;
    } else if (key_code == _master_keys['up']) {      //up (previous)
      if (_search_selected > 0) {        _search_selected--;
        var li=$id('li_' + _search_selected);
        clear_selected_search(li);
        li.className='selected';
      }
      this.value=this.value;
      return false;
    } else if (key_code == _master_keys['enter']) {      //enter
      if (_search_selected != -1) {        var li=$id('li_' + _search_selected);
        if (li) {          li.getElementsByTagName('INPUT')[0].click();
          this.value='';
          this.className='';
          filter_resource_search(
            '',
            this.getAttribute('task_id'),
            $id('task_resource_search_result_' + this.getAttribute('task_id'))
          );
          update_resource_search_height(
            $id('task_choose_resource_' + this.getAttribute('task_id'))
          );
        }
      }
    } else {      filter_resource_search(
        this.value,
        this.getAttribute('task_id'),
        $id('task_resource_search_result_' + this.getAttribute('task_id'))
      );
      update_resource_search_height(
        $id('task_choose_resource_' + this.getAttribute('task_id'))
      );
    }
  };
  search_box.appendChild(search_input);
  div.appendChild(search_box);
  //resource list
  var rlist=$create('DIV');
  rlist.className='resource_search_results';
  rlist.id='task_resource_search_result_' + task_id;
  div.appendChild(rlist);
  filter_resource_search('', task_id, rlist);
  clear_text();
  return div;
}
function update_resource_search_height(ele) {  if (ele) {    var height_correct=0;
    if (ele.parentNode.id == 'edit_window_edit_resources') {      ele=$id('edit_window_edit_resources');
      height_correct=-6;
    }
    if (ele.parentNode.id == 'people_assigned_column_edit_resources') {      ele=$id('people_assigned_column_edit_resources');
      height_correct=0;
    }
    ele.className=trim(ele.className.replace(/extra_classes/g, ''));
    ele.style.height='auto';
    var height=ele.offsetHeight * 1;
    ele.style.height=height + height_correct + 'px';
    ele.className += ' extra_classes';
  }}
function clear_selected_search(li) {  var div=li.parentNode.parentNode;
  var lis=div.getElementsByTagName('LI');
  var lisl=lis.length;
  for (var i=0; i < lisl; i++) {    lis[i].className='';
  }}
function task_calendar_days(task_id) {  //TASK DURATION
  var task_weeks=_tasks[_tasks_key[task_id]]['weeks'];
  var project_days_in_week =
    _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
      'chart_days'
    ].split(',').length;
  var task_days=_tasks[_tasks_key[task_id]]['days'];
  var task_total_days=task_weeks * project_days_in_week + task_days * 1;
  return task_total_days;
}
function filter_resource_search(string, task_id, ele) {  remove_child_nodes(ele);
  var show_hours=false;
  var task=_tasks[_tasks_key[task_id]];
  var user_resources=task['user_resources'];
  var company_resources=task['company_resources'];
  var custom_resources=task['custom_resources'];
  var res=new Array();
  res[0]=['People', ['user'], [user_resources]];
  res[1]=[
    'Labels',
    ['company', 'custom'],
    [company_resources, custom_resources],
  ];
  var c=0;
  var people_ul=null;
  var resl=res.length;
  for (var r=0; r < resl; r++) {    var header=$create('DIV');
    header.className='resource_title';
    if (r > 0) {      header.style.marginTop='0.5em';
    }
    //NAME
    var header_name=$create('DIV');
    header_name.className='resource_name';
    header_name.appendChild($text(res[r][0]));
    header.appendChild(header_name);
    ele.appendChild(header);
    //TASK DURATION
    var task_total_days=task_calendar_days(task_id);
    var ul=$create('UL');
    var used_names=0;
    var ar_len=_all_resources.length;
    for (var i=0; i < ar_len; i++) {      var resource_info=_all_resources[i];
      var LINK_TYPE=getNodeValue(resource_info, 'LINK_TYPE');
      var PROJECT_ID=getNodeValue(resource_info, 'PROJECT_ID');
      var RESOURCE_ID=getNodeValue(resource_info, 'RESOURCE_ID');
      var RESOURCE_NAME=getNodeValue(resource_info, 'RESOURCE_NAME');
      var RESOURCE_IS_DISABLED=getNodeValue(
        resource_info,
        'RESOURCE_IS_DISABLED'
      );
      var array_key=js_in_array(LINK_TYPE, res[r][1]);
      if (
        array_key > -1 &&
        js_in_array(task['project_id'], PROJECT_ID.split(',')) > -1
      ) {        var in_string=false;
        if (string == '') {          in_string=true;
        } else {          if (
            no_spaces(RESOURCE_NAME.toLowerCase()).indexOf(
              no_spaces(string.toLowerCase())
            ) > -1
          ) {            var in_string=true;
          }
        }
        var resource_data =
          _tasks[_tasks_key[task_id]][LINK_TYPE + '_resources'][RESOURCE_ID];
        if (RESOURCE_IS_DISABLED == 1 && resource_data == undefined) {          in_string=false;
        }
        if (in_string == true) {          PROJECT_ID=task['project_id'];
          used_names++;
          if (used_names == 1) {            //HOURS
            if (
              _projects[_projects_key[PROJECT_ID]]['project_enable_hours'] == 1
            ) {              show_hours=true;
              //AVG HOURS
              var header_avg_hours=$create('DIV');
              header_avg_hours.className='resource_avg_hours';
              header_avg_hours.appendChild($text('Avg Hrs/Day'));
              header.appendChild(header_avg_hours);
              //TOTAL HOURS
              var header_total_hours=$create('DIV');
              header_total_hours.className='resource_total_hours';
              header_total_hours.appendChild($text('Total Hrs'));
              header.appendChild(header_total_hours);
            }
          }
          var li=$create('LI');
          li.id='li_' + c;
          if (c == 0 && string != '') {            li.className='selected';
          }
          //RESOURCE NAME
          var label=$create('LABEL');
          label.className='resource_name';
          label.style.zIndex=100001;
          var input=$create('INPUT');
          input.type='checkbox';
          input.id =
            'resource_' + task_id + '_' + LINK_TYPE + '_' + RESOURCE_ID;
          input.setAttribute('assign_type', 'new');
          input.setAttribute('resource_type', LINK_TYPE);
          input.setAttribute('task_id', task_id);
          input.setAttribute('resource_id', RESOURCE_ID);
          input.setAttribute('resource_name', RESOURCE_NAME);
          input.setAttribute(
            'assigned_id',
            resource_data ? resource_data['assigned_id'] : ''
          );
          input.setAttribute(
            'v',
            LINK_TYPE + '-' + RESOURCE_ID + '-' + task_id
          );
          input.checked=resource_data != undefined ? true : false;
          input.onclick=function () {            var is_checked=this.checked == true ? '1' : '0';
            if (
              _multi_select &&
              _multi_select.element_ids &&
              _multi_select.element_ids.length > 1
            ) {              //SAVE MULTIPLE
              var brk=this.getAttribute('v').split('-');
              var base=brk[0] + '-' + brk[1] + '-';
              var msel=_multi_select.element_ids.length;
              for (var i=0; i < msel; i++) {                var the_task_id=_multi_select.element_ids[i];
                //UPDATE RESOURCE LIST
                if (is_checked == '1') {                  if (
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')] == undefined
                  ) {                    //ADD RESOURCE
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')]=[];
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')]['resource_id'] =
                      this.getAttribute('resource_id');
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')]['hours_per_day']='';
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')]['total_hours']='';
                    //DISPLAY CHANGE
                    update_resource_hours_multiple(
                      the_task_id,
                      this.getAttribute('resource_type'),
                      this.getAttribute('resource_id'),
                      this.getAttribute('assigned_id'),
                      true
                    );
                    refresh_task_resources(the_task_id);
                  } else {                    //ALREADY ASSIGNED - DO NOT TOUCH
                  }
                } else {                  var assignment =
                    _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')];
                  if (assignment) {                    var assigned_id=assignment['assigned_id'];
                    delete _tasks[_tasks_key[the_task_id]][
                      this.getAttribute('resource_type') + '_resources'
                    ][this.getAttribute('resource_id')];
                    //DISPLAY CHANGE
                    update_resource_hours_multiple(
                      the_task_id,
                      this.getAttribute('resource_type'),
                      this.getAttribute('resource_id'),
                      assigned_id,
                      false
                    );
                    refresh_task_resources(the_task_id);
                  }
                }
              }
            } else {              //SAVE JUST THIS TASK
              if (is_checked == '1') {                //ADD RESOURCE
                _tasks[_tasks_key[this.getAttribute('task_id')]][
                  this.getAttribute('resource_type') + '_resources'
                ][this.getAttribute('resource_id')]=[];
                _tasks[_tasks_key[this.getAttribute('task_id')]][
                  this.getAttribute('resource_type') + '_resources'
                ][this.getAttribute('resource_id')]['resource_id'] =
                  this.getAttribute('resource_id');
                _tasks[_tasks_key[this.getAttribute('task_id')]][
                  this.getAttribute('resource_type') + '_resources'
                ][this.getAttribute('resource_id')]['hours_per_day']='';
                _tasks[_tasks_key[this.getAttribute('task_id')]][
                  this.getAttribute('resource_type') + '_resources'
                ][this.getAttribute('resource_id')]['total_hours']='';
              } else {                //REMOVE THE RESOURCE
                delete _tasks[_tasks_key[this.getAttribute('task_id')]][
                  this.getAttribute('resource_type') + '_resources'
                ][this.getAttribute('resource_id')];
              }
              //RUN SAVE
              update_resource_hours(this);
              refresh_task_resources(this.getAttribute('task_id'));
            }
            if (
              $id('edit_window') &&
              $id('edit_window').getAttribute('target_id') ==
                this.getAttribute('task_id')
            ) {              if (this.getAttribute('resource_type') == 'user') {                var input=$id('edit_window_assigned_users');
              } else if (this.getAttribute('resource_type') == 'company') {                var input=$id('edit_window_assigned_company');
              } else if (
                this.getAttribute('resource_type') == 'project' ||
                this.getAttribute('resource_type') == 'custom'
              ) {                var input=$id('edit_window_assigned_project');
              }
              if (input) {                var array =
                  input.value == '' ? new Array() : input.value.split(',');
                if (
                  is_checked == '1' &&
                  js_in_array(this.getAttribute('resource_id'), array) == -1
                ) {                  array.push(this.getAttribute('resource_id'));
                } else if (
                  is_checked != '1' &&
                  js_in_array(this.getAttribute('resource_id'), array) > -1
                ) {                  var key=js_in_array(
                    this.getAttribute('resource_id'),
                    array
                  );
                  delete array[key];
                }
                var new_value=array.join(',');
                input.value=new_value;
              }
            }
            track_segment_event(
              'gantt-toggled-task-assignment-from-task-assign-dropdown'
            );
          };
          label.appendChild(input);
          resource_name =
            RESOURCE_IS_DISABLED == 1
              ? RESOURCE_NAME + ' (deactivated)'
              : RESOURCE_NAME;
          label.appendChild($text(resource_name));
          li.appendChild(label);
          //HOURS
          if (
            _projects[_projects_key[PROJECT_ID]]['project_enable_hours'] == 1 &&
            (_multi_select == null || _multi_select.element_ids.length <= 1)
          ) {            //AVG HOURS PER DAY
            var avg_hours=$create('DIV');
            avg_hours.className='resource_avg_hours';
            var resource_data =
              _tasks[_tasks_key[task_id]][LINK_TYPE + '_resources'][
                RESOURCE_ID
              ];
            var avg_hours_input=$create('INPUT');
            avg_hours_input.id =
              'resource_avg_hours_' +
              task_id +
              '_' +
              LINK_TYPE +
              '_' +
              RESOURCE_ID;
            avg_hours_input.type='text';
            avg_hours_input.size=4;
            avg_hours_input.setAttribute('assign_type', 'per_day');
            avg_hours_input.setAttribute('resource_type', LINK_TYPE);
            avg_hours_input.setAttribute('task_id', task_id);
            avg_hours_input.setAttribute('resource_id', RESOURCE_ID);
            avg_hours_input.setAttribute('resource_name', RESOURCE_NAME);
            avg_hours_input.setAttribute(
              'assigned_id',
              resource_data ? resource_data['assigned_id'] : ''
            );
            avg_hours_input.setAttribute('task_days', task_total_days);
            avg_hours_input.setAttribute('autocomplete', 'off');
            avg_hours_input.onchange=function () {              update_resource_hours(this);
            };
            avg_hours_input.value=resource_data
              ? resource_data['hours_per_day'] * 1
              : '';
            avg_hours_input.disabled=task_total_days == 0 ? true : false;
            avg_hours.appendChild(avg_hours_input);
            if (task_total_days == 0) {              avg_hours_input.style.display='none';
              var alert_triangle=$create('DIV');
              alert_triangle.className='resource_alert_triangle';
              alert_triangle.onclick=function () {                custom_alert(
                  'First draw the task bar in the gantt chart to define how many days the task will be.<br /><br />You can then enter the avg hours per day if you like.'
                );
              };
              var i_ele=$create('I');
              i_ele.className='fa fa-exclamation-triangle';
              alert_triangle.appendChild(i_ele);
              avg_hours.appendChild(alert_triangle);
            } else {              avg_hours.appendChild($text(' x ' + task_total_days + ' days'));
            }
            li.appendChild(avg_hours);
            //TOTAL EST HOURS
            var est_hours=$create('DIV');
            est_hours.className='resource_total_hours';
            var resource_data =
              _tasks[_tasks_key[task_id]][LINK_TYPE + '_resources'][
                RESOURCE_ID
              ];
            var est_hours_input=$create('INPUT');
            est_hours_input.id =
              'resource_total_hours_' +
              task_id +
              '_' +
              LINK_TYPE +
              '_' +
              RESOURCE_ID;
            est_hours_input.type='text';
            est_hours_input.size=3;
            est_hours_input.setAttribute('assign_type', 'total');
            est_hours_input.setAttribute('resource_type', LINK_TYPE);
            est_hours_input.setAttribute('task_id', task_id);
            est_hours_input.setAttribute('resource_id', RESOURCE_ID);
            est_hours_input.setAttribute('resource_name', RESOURCE_NAME);
            est_hours_input.setAttribute(
              'assigned_id',
              resource_data ? resource_data['assigned_id'] : ''
            );
            est_hours_input.setAttribute('autocomplete', 'off');
            est_hours_input.onchange=function () {              update_resource_hours(this);
            };
            est_hours_input.value=resource_data
              ? resource_data['total_hours'] * 1
              : '';
            est_hours.appendChild(est_hours_input);
            li.appendChild(est_hours);
          }
          var clear=$create('DIV');
          clear.className='clear';
          if (input.checked == false) {            li.className += ' inactive';
          }
          li.appendChild(clear);
          ul.appendChild(li);
          c++;
        }
      }
    }
    ele.appendChild(ul);
    if (LINK_TYPE == 'user') {      people_ul=ul;
    }
    if (used_names == 0) {      ul.previousSibling.style.display='none';
      ul.parentNode.removeChild(ul);
    }
  }
  _search_length=c--;
  _search_selected=string == '' ? -1 : 0;
  //ADD MORE PEOPLE
  var add_people_div=$create('DIV');
  add_people_div.className='invite_more_people';
  var span=$create('SPAN');
  span.appendChild($text('Add new person/label'));
  span.setAttribute('project_id', task['project_id']);
  span.setAttribute('task_id', task_id);
  span.onclick=function () {    $id('header_load_resources').click();
    _reopen_badge='resources';
    _reopen_badge_details=['task', this.getAttribute('task_id')];
    var col_resource=$id('people_assigned_column_edit_resources');
    if (col_resource && col_resource.className != 'hidden') {      _reopen_badge='resources-column';
      col_resource.parentNode.removeChild(col_resource);
    }
    if ($id('project_iframe')) {      $id('project_iframe').setAttribute('open_resources', 'open_resources');
      if (this.parentNode.parentNode.parentNode.parentNode.parentNode) {        this.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
          this.parentNode.parentNode.parentNode.parentNode
        );
      }
    }
    track_segment_event('gantt-click-to-invite-people-from-task-assign');
  };
  add_people_div.appendChild(span);
  ele.appendChild(add_people_div);
  //HOURS
  if (show_hours) {    if (_multi_select == null || _multi_select.element_ids.length <= 1) {      var hours_summary=$create('DIV');
      hours_summary.className='hours_summary clear';
      //ASSIGNED HOURS
      var total_assigned_hours=$create('DIV');
      total_assigned_hours.className='total_assigned_hours';
      var tah_title=$create('DIV');
      tah_title.appendChild($text('Total Assigned Hours: '));
      tah_title.className='left_side';
      total_assigned_hours.appendChild(tah_title);
      var total_assigned_hours_sum=$create('SPAN');
      total_assigned_hours_sum.id='total_assigned_hours_sum_' + task_id;
      total_assigned_hours_sum.appendChild($text(task['assigned_hours']));
      total_assigned_hours.appendChild(total_assigned_hours_sum);
      var clear=$create('DIV');
      clear.className='clear';
      total_assigned_hours.appendChild(clear);
      hours_summary.appendChild(total_assigned_hours);
      //UNASSIGNED HOURS
      var task_unassigned_hours =
        (task['estimated_hours'] * 100 - task['assigned_hours'] * 100) / 100;
      var total_unassigned_hours=$create('DIV');
      total_unassigned_hours.className =
        task_unassigned_hours >= 0 ? 'total_unassigned_hours' : 'hidden';
      var tuh_title=$create('DIV');
      tuh_title.className='left_side';
      var tspan=$create('SPAN');
      tspan.style.color='#c34a36';
      tspan.style.fontWeight='bold';
      tspan.appendChild($text('! '));
      tuh_title.appendChild(tspan);
      tuh_title.appendChild($text('Total Unassigned Hours: '));
      total_unassigned_hours.appendChild(tuh_title);
      var total_unassigned_hours_sum=$create('SPAN');
      total_unassigned_hours_sum.id='total_unassigned_hours_sum_' + task_id;
      total_unassigned_hours_sum.appendChild($text(task_unassigned_hours));
      total_unassigned_hours.appendChild(total_unassigned_hours_sum);
      var clear=$create('DIV');
      clear.className='clear';
      total_unassigned_hours.appendChild(clear);
      hours_summary.appendChild(total_unassigned_hours);
      //OVER ASSIGNED HOURS
      var task_overassigned_hours_num =
        (task['estimated_hours'] - task['assigned_hours']) * -1;
      var task_overassigned_hours=$create('DIV');
      task_overassigned_hours.className =
        task_overassigned_hours_num != 0
          ? 'total_over_assigned_hours'
          : 'hidden';
      if (_version != 'gantt_chart') {        task_overassigned_hours.style.display='none';
      }
      //MESSAGE
      var toh_title=$create('DIV');
      var total_overassigned_hours_sum=$create('SPAN');
      total_overassigned_hours_sum.id =
        'total_overassigned_hours_sum_' + task_id;
      //IF OVER OR UNDER
      if (task_overassigned_hours_num > 0) {        toh_title.appendChild($text('Above Estimated Hours By: '));
        total_overassigned_hours_sum.appendChild(
          $text(task_overassigned_hours_num)
        );
      } else {        toh_title.appendChild($text('Below Estimated Hours By: '));
        total_overassigned_hours_sum.appendChild(
          $text(task_overassigned_hours_num * -1)
        );
      }
      //APPEND MESSAGE
      task_overassigned_hours.appendChild(toh_title);
      task_overassigned_hours.appendChild(total_overassigned_hours_sum);
      var fixit=$create('DIV');
      fixit.className='overassigned_fix';
      task_overassigned_hours.appendChild(fixit);
      var opts=[];
      opts.push(['keep_assigned', 'Fix by making it a XX hour task. ']);
      for (var o=0; o < opts.length; o++) {        var opt=opts[o];
        var opt_text=opt[1].split('XX');
        var opt_div=$create('DIV');
        opt_div.appendChild($text(opt_text[0] + ' '));
        var opt_div_amt=$create('B');
        opt_div_amt.id='overassigned_hours_' + opt[0] + '_' + task_id;
        opt_div_amt.appendChild($text(task['assigned_hours']));
        opt_div.appendChild(opt_div_amt);
        opt_div.appendChild($text(' ' + opt_text[1]));
        fixit.appendChild(opt_div);
        var br=$create('br');
        opt_div.appendChild(br);
        //BUTTON
        var fix_button=$create('INPUT');
        fix_button.type='button';
        fix_button.className='red_button';
        fix_button.value='Fix';
        fix_button.setAttribute('task_id', task_id);
        fix_button.setAttribute('keep_what', opt[0]);
        fix_button.id='fix_it_button_' + opt[0] + '_' + task_id;
        if (
          opts[o][0] == 'keep_assigned' &&
          (_version == 'gantt_chart' || _version == 'list_view')
        ) {          fix_button.onclick=function () {            var hours_input=$id(
              'task_estimated_hours_' + this.getAttribute('task_id')
            );
            remove_child_nodes(hours_input);
            hours_input.appendChild(
              $text(
                $id(
                  'overassigned_hours_keep_assigned_' +
                    this.getAttribute('task_id')
                ).firstChild.nodeValue
              )
            );
            hours_input.onblur();
            update_task_assigned_hour(this.getAttribute('task_id'));
            track_segment_event('gantt-clicked-to-fix-hours-from-task-assign');
          };
          if (_tasks[_tasks_key[task_id]]['estimated_hours'] == 0) {            fix_button.setAttribute('auto_adjust_hours', 1);
          }
        }
        opt_div.appendChild(fix_button);
      }
      var clear=$create('DIV');
      clear.className='clear';
      clear.style.height='1em';
      task_overassigned_hours.appendChild(clear);
      hours_summary.appendChild(task_overassigned_hours);
      ele.appendChild(hours_summary);
    } else {      var target_ul=ele.getElementsByTagName('UL')[0];
      var multi_warning=$create('DIV');
      multi_warning.className='hours_multi_assign_error';
      var warning_wrapper=$create('DIV');
      multi_warning.appendChild(warning_wrapper);
      var warning_message=$create('DIV');
      warning_message.appendChild(
        $text(
          'When assigning to multiple tasks, the first person selected will be assigned all remaining hours.'
        )
      );
      warning_wrapper.appendChild(warning_message);
      target_ul.parentNode.appendChild(multi_warning);
    }
  }
  var d2=$create('DIV');
  d2.className='manage_resources clear';
  var done=$create('BUTTON');
  done.id='resource_assign_done_button';
  done.className='blue_button resource_done_button';
  done.appendChild($text('Done'));
  done.onclick=function () {    hide_backdrop();
    var ele=this.parentNode.parentNode.parentNode.parentNode;
    ele.parentNode.removeChild(ele);
    if ($id('edit_window')) {      edit_window_adjust_task_resources();
    } else {      clear_utility_box();
      display_resource_view('nosave');
      var force_close=$id(
        this.getAttribute('type') +
          '_choose_resource_' +
          this.getAttribute('type_id')
      );
      if (force_close) {        force_close.parentNode.removeChild(force_close);
      }
    }
    track_segment_event('gantt-clicked-done-button-from-task-assign');
  };
  d2.appendChild(done);
  ele.appendChild(d2);
  var clear=$create('DIV');
  clear.className='clear';
  ele.appendChild(clear);
}
function update_resource_hours(ele) {  var task_id=ele.getAttribute('task_id');
  var link_type=ele.getAttribute('resource_type');
  var resource_id=ele.getAttribute('resource_id');
  var assigned_id=ele.getAttribute('assigned_id');
  if (
    _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
      'project_enable_hours'
    ] == 1
  ) {    var per_day=$id(
      'resource_avg_hours_' + task_id + '_' + link_type + '_' + resource_id
    );
    var total_hours=$id(
      'resource_total_hours_' + task_id + '_' + link_type + '_' + resource_id
    );
    var task_days=per_day.getAttribute('task_days') * 1;
    var task_hours=_tasks[_tasks_key[task_id]]['estimated_hours'];
    if (ele.getAttribute('assign_type') == 'new') {      var assigned_hours=_tasks[_tasks_key[task_id]]['assigned_hours'];
      var unassigned_hours =
        Math.round((task_hours - assigned_hours) * 100) / 100;
      if (ele.checked) {        if (unassigned_hours > 0) {          total_hours.value=Math.round(unassigned_hours * 100) / 100;
          var per_day_math=unassigned_hours / task_days;
          per_day.value=Math.round(per_day_math * 100) / 100;
        }
      } else {        per_day.value='';
        total_hours.value='';
      }
    } else if (ele.getAttribute('assign_type') == 'per_day') {      total_hours.value=Math.round(per_day.value * task_days * 100) / 100;
    } else if (ele.getAttribute('assign_type') == 'total') {      var per_day_math=total_hours.value / task_days;
      per_day.value=Math.round(per_day_math * 100) / 100;
    }
    //CLEANUP
    per_day.value=per_day.value * 1 < 0 ? 0 : per_day.value;
    total_hours.value=total_hours.value * 1 < 0 ? 0 : total_hours.value;
    if (task_days == 0) {      per_day.value=0;
      per_day.disabled=true;
    } else {      per_day.disabled=false;
    }
    var hours_per_day_value=per_day.value;
    var total_hours_value=total_hours.value;
    var input=$id(
      'resource_' + task_id + '_' + link_type + '_' + resource_id
    );
    if (input) {      //SAVE THE CHANGE
      input.setAttribute(
        'v',
        link_type +
          '-' +
          resource_id +
          '-' +
          task_id +
          '-' +
          hours_per_day_value +
          '-' +
          total_hours_value
      );
      var is_checked=input.checked == true ? 1 : 0;
      if (!is_checked && assigned_id) {        remove_resource(task_id, link_type, resource_id, assigned_id);
      } else if (is_checked && assigned_id) {        update_task_resource(
          task_id,
          assigned_id,
          {            hours_per_day: parseFloat(hours_per_day_value),
            total_hours: parseFloat(total_hours_value),
          },
          function () {            add_task_to_workloads_refresh.add_task(task_id);
          }
        );
      } else {        add_resource(task_id, {          task_id: parseInt(task_id),
          type: link_type === 'custom' ? 'project' : link_type,
          type_id: parseInt(resource_id),
          hours_per_day: parseFloat(hours_per_day_value),
          total_hours: parseFloat(total_hours_value),
        });
      }
      //UPDATE JS VALUES
      if (_tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id]) {        _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id][
          'hours_per_day'
        ]=hours_per_day_value;
        _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id][
          'total_hours'
        ]=total_hours_value;
      }
      update_task_assigned_hour(task_id);
    } else {      custom_alert(
        'There was an error calculating the hours. Please refresh the page and try again'
      );
    }
    var li=input.parentNode.parentNode;
    if (input.checked) {      li.className=trim(li.className.replace(/inactive/g, ''));
    } else {      li.className += ' inactive';
    }
  } else {    //IF NOT USING HOURS ON THE PROJECT
    //SAVE THE CHANGE
    var is_checked=ele.checked == true ? 1 : 0;
    if (is_checked && !assigned_id) {      add_resource(task_id, {        task_id: parseInt(task_id),
        type: link_type === 'custom' ? 'project' : link_type,
        type_id: parseInt(resource_id),
      });
    } else if (!is_checked && assigned_id) {      remove_resource(task_id, link_type, resource_id, assigned_id);
    } else if (is_checked && assigned_id) {      // do nothing
    } else {      load_gantt();
    }
  }}
function update_resource_hours_multiple(
  task_id,
  link_type,
  resource_id,
  assigned_id,
  checked
) {  if (checked == true) {    var task_hours=_tasks[_tasks_key[task_id]]['estimated_hours'] * 1;
    var assigned_hours=_tasks[_tasks_key[task_id]]['assigned_hours'] * 1;
    var unassigned_hours=task_hours - assigned_hours;
    var task_days=task_calendar_days(task_id);
    var total_hours=unassigned_hours * 1;
    var hours_per_day_math=total_hours / task_days;
    var hours_per_day=Math.round(hours_per_day_math * 100) / 100;
    total_hours=total_hours < 0 ? 0 : total_hours;
    hours_per_day=hours_per_day < 0 ? 0 : hours_per_day;
    //UPDATE JS VALUES
    if (
      _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id] ==
      undefined
    ) {      _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id]=[];
      _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id][
        'resource_id'
      ]=resource_id;
    }
    if (_tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id]) {      _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id][
        'hours_per_day'
      ]=hours_per_day;
      _tasks[_tasks_key[task_id]][link_type + '_resources'][resource_id][
        'total_hours'
      ]=total_hours;
      if (assigned_id) {        update_task_resource(
          task_id,
          assigned_id,
          {            hours_per_day: hours_per_day,
            total_hours: total_hours,
          },
          function () {            add_task_to_workloads_refresh.add_task(task_id);
          }
        );
      } else {        add_resource(task_id, {          task_id: parseInt(task_id),
          type: link_type === 'custom' ? 'project' : link_type,
          type_id: parseInt(resource_id),
          hours_per_day: hours_per_day,
          total_hours: total_hours,
        });
      }
      update_task_assigned_hour(task_id);
    }
  } else {    remove_resource(task_id, link_type, resource_id, assigned_id);
    update_task_assigned_hour(task_id);
  }}
function update_task_assigned_hour(task_id) {  var user_resources=_tasks[_tasks_key[task_id]]['user_resources'];
  var company=_tasks[_tasks_key[task_id]]['company_resources'];
  var project=_tasks[_tasks_key[task_id]]['custom_resources'];
  var all_res=[user_resources, company, project];
  var assigned_hours=0;
  for (var key in all_res) {    for (var k in all_res[key]) {      if (all_res[key][k]['total_hours']) {        assigned_hours += all_res[key][k]['total_hours'] * 1;
      }
    }
  }
  _tasks[_tasks_key[task_id]]['assigned_hours']=assigned_hours;
  if ($id('total_assigned_hours_sum_' + task_id)) {    //TOTAL ASSIGNED HOURS
    var total_assigned=$id('total_assigned_hours_sum_' + task_id);
    total_assigned.firstChild.nodeValue=assigned_hours;
    //REMAINING HOURS TO BE ASSIGNED
    var unassigned_hours =
      (_tasks[_tasks_key[task_id]]['estimated_hours'] * 100 -
        assigned_hours * 100) /
      100;
    var total_unassigned=$id('total_unassigned_hours_sum_' + task_id);
    total_unassigned.firstChild.nodeValue=unassigned_hours;
    total_unassigned.parentNode.className =
      unassigned_hours < 0 ? 'hidden' : 'total_unassigned_hours';
    //OVER SCHEDULED HOURS
    var total_over_assigned=$id('total_overassigned_hours_sum_' + task_id);
    total_over_assigned.parentNode.className =
      unassigned_hours == 0 ? 'hidden' : 'total_over_assigned_hours';
    if (unassigned_hours < 0) {      //IF TOO MUCH WAS ESTIMATED
      var d=total_over_assigned.previousSibling;
      total_over_assigned.firstChild.nodeValue=unassigned_hours * -1;
      d.firstChild.nodeValue=d.firstChild.nodeValue.replace(
        /Below/g,
        'Above'
      );
    } else {      //IF TOO FEW WAS ESTIMATED
      var d=total_over_assigned.previousSibling;
      d.firstChild.nodeValue=d.firstChild.nodeValue.replace(
        /Above/g,
        'Below'
      );
      total_over_assigned.firstChild.nodeValue=unassigned_hours;
    }
    //KEEP ASSIGNED HOURS
    if ($id('overassigned_hours_keep_assigned_' + task_id)) {      $id('overassigned_hours_keep_assigned_' + task_id).firstChild.nodeValue =
        assigned_hours * 1;
    }
  }
  //update_resource_search_height($id("task_choose_resource_"+task_id));
  refresh_task_resources(task_id);
  //update_hours_indicator(task_id);
  if (
    assigned_hours > 0 &&
    $id('fix_it_button_keep_assigned_' + task_id) &&
    $id('fix_it_button_keep_assigned_' + task_id).getAttribute(
      'auto_adjust_hours'
    ) == '1'
  ) {    $id('fix_it_button_keep_assigned_' + task_id).click();
  }}
function refresh_task_resources(task_id) {  var task=_tasks[_tasks_key[task_id]];
  var user_resources=task['user_resources'];
  var company_resources=task['company_resources'];
  var custom_resources=task['custom_resources'];
  var arr=[];
  for (var i=0; i < _all_resources.length; i++) {    var resource_info=_all_resources[i];
    var LINK_TYPE=getNodeValue(resource_info, 'LINK_TYPE');
    var PROJECT_ID=getNodeValue(resource_info, 'PROJECT_ID');
    var RESOURCE_ID=getNodeValue(resource_info, 'RESOURCE_ID');
    var RESOURCE_NAME=getNodeValue(resource_info, 'RESOURCE_NAME').replace(
      /</g,
      '&lt;'
    );
    var raci_role=get_raci_role_for_target(
      'task',
      task_id,
      LINK_TYPE,
      RESOURCE_ID
    );
    if (task[LINK_TYPE + '_resources'][RESOURCE_ID] != undefined) {      var alen=arr.length;
      arr[alen]=raci_role
        ? [RESOURCE_NAME, raci_role].join(' ')
        : RESOURCE_NAME;
      if (
        _version == 'gantt_chart' &&
        _projects[_projects_key[task['project_id']]]['project_enable_hours'] ==
          1 &&
        $id('show_resource_hours_per_day').checked == true
      ) {        arr[alen] +=
          " <span class='hours_per_day'>(" +
          task[LINK_TYPE + '_resources'][RESOURCE_ID]['hours_per_day'] * 1 +
          ' hrs/day)</span>';
      }
    }
  }
  arr.sort();
  var resource_string=arr.join(', ');
  if (_version == 'list_view' && arr.length == 0) {    resource_string='click to assign';
  }
  //UPDATE AFTER BAR OR LIST VIEW
  var tgt=$id('task_resources_list_' + task_id);
  if (tgt) {    remove_child_nodes(tgt);
    if (_version == 'list_view') {      tgt.innerHTML=resource_string;
      if (arr.length == 0) {        tgt.parentNode.className += ' unassigned';
      } else {        tgt.parentNode.className=trim(
          tgt.parentNode.className.replace(/unassigned/g, '')
        );
      }
    } else if (
      _version == 'gantt_chart' &&
      $id('show_resources_in_gantt').checked == true
    ) {      tgt.innerHTML=resource_string;
    }
  }
  //UPDATE COLUMN
  var target2=$id('task_assigned_resources_' + task_id);
  if (target2) {    var project_permission =
      _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
        'project_permission'
      ];
    if (
      resource_string == '' &&
      (project_permission == 'admin' || project_permission == 'edit')
    ) {      resource_string='assign';
      target2.className='assign_text';
    } else {      target2.className='';
    }
    remove_child_nodes(target2);
    target2.innerHTML=resource_string;
  }
  update_hours_indicator(task_id);
}
function update_hours_indicator(task_id) {  if (
    _tasks[_tasks_key[task_id]] &&
    _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
      'project_enable_hours'
    ] == 1
  ) {    var target_div=$id('task_assigned_resources_' + task_id);
    if (target_div) {      var task=_tasks[_tasks_key[task_id]];
      var user_resources=task['user_resources'];
      var company_resources=task['company_resources'];
      var custom_resources=task['custom_resources'];
      var resource_length=0;
      for (var r in user_resources) {        if (user_resources[r]['resource_id'] != '') {          resource_length++;
        }
      }
      for (var r in company_resources) {        if (company_resources[r]['resource_id'] != '') {          resource_length++;
        }
      }
      for (var r in custom_resources) {        if (custom_resources[r]['resource_id'] != '') {          resource_length++;
        }
      }
      if (
        _tasks[_tasks_key[task_id]]['assigned_hours'] * 1 ==
          _tasks[_tasks_key[task_id]]['estimated_hours'] * 1 ||
        resource_length == 0
      ) {        //REMOVE ERROR SPAN
        var first_child=target_div.firstChild;
        if (first_child != undefined && first_child.className == 'error') {          target_div.removeChild(first_child);
        }
      } else {        target_div.parentNode.className += ' error';
        var exc=$create('SPAN');
        exc.className='error';
        exc.appendChild($text('! '));
        target_div.insertBefore(exc, target_div.firstChild);
      }
    }
  }}
////// COLORS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function default_color(color) {  var colors=_colors;
  var parent=$id('set_default_color_picker');
  remove_child_nodes(parent);
  for (var i=0; i < colors.length; i++) {    var div=$create('DIV');
    div.className='color_picker';
    var color_div=$create('DIV');
    color_div.className=colors[i];
    color_div.className += colors[i] == color ? ' selected' : '';
    color_div.onclick=(function (color) {      return function () {        set_default_color(color, true);
      };
    })(colors[i]);
    div.appendChild(color_div);
    parent.appendChild(div);
  }}
function set_default_color(color, do_save) {  $id('color_picker_dd').firstChild.className='text ' + color;
  default_color(color);
  _default_color=color;
  if (do_save == true) {    update_preference({default_color: color});
    track_segment_event('gantt-changed-global-default-task-color');
  }}
function set_task_color(type, type_id, color) {  var colors=_colors;
  color=color == '' || color == null ? colors[0] : color;
  if (type == 'group') {    var parent=$id('group_bar_target_' + type_id);
    if (parent) {      var divs=parent.getElementsByTagName('DIV');
      for (var d=0; d < divs.length; d++) {        if (divs[d].className.indexOf('task_in_chart') != -1) {          set_task_color('task', divs[d].getAttribute('task_id'), color);
        }
      }
    }
    set_task_color('group_force', type_id, color);
  } else {    if (type == 'group_force') {      type='group';
    }
    var target =
      _version == 'gantt_chart'
        ? $id(type + '_div_' + type_id)
        : $id(type + '_bar_column_' + type_id);
    var badge=$id(type + '_badge_' + type_id);
    if (target) {      //remove any color that could be there
      for (var i=0; i < colors.length; i++) {        target.className=trim(target.className.replace(colors[i], ''));
      }
      target.className += ' ' + color;
    }
    if (badge) {      //remove any color that could be there
      for (var i=0; i < colors.length; i++) {        badge.className=trim(badge.className.replace(colors[i], ''));
      }
      badge.className += ' ' + color;
    }
    if (type == 'task') {      _tasks[_tasks_key[type_id]]['color']=color;
    }
    //IF EDIT WINDOW IS OPEN
    var edit_window=$id('edit_window');
    if (
      edit_window &&
      edit_window.getAttribute('target') == type &&
      edit_window.getAttribute('target_id') == type_id
    ) {      $id('edit_window_header').className=color;
      $id('edit_window_header_percent_complete').className=color;
      $id('task_color_bar').className += 'x ' + color;
    }
  }}
function highlight_color(ele) {  //unselect all
  var colors=ele.parentNode.getElementsByTagName('DIV');
  for (var i=0; i < colors.length; i++) {    colors[i].className=trim(colors[i].className.replace(/selected/g, ''));
  }
  ele.firstChild.className += ' selected';
}
function clear_utility_box() {  if ($id('edit_window_edit_resources') == null) {    //INLINE REMOVE
    remove_child_nodes($id('utility_box'));
    remove_background_cover(null);
    allow_hover=true;
    unhighlight_all('', '');
    document.body.style.overflow='auto';
  } else {    //FROM EDIT WINDOW
    var div=$id('edit_window_edit_resources');
    div.setAttribute('keep', 0);
    div.setAttribute('mouse_over', 0);
    div.parentNode.removeChild(div);
  }
  //CLEAR (OR RELOAD) TOOL TIP IF NEEDED
  if (
    _tooltip_step == 'resources' &&
    _tooltip_progress == 1 &&
    _show_tooltips < 2
  ) {    close_tooltip('resources');
    display_tooltip('resources', '', '');
  } else if (
    _tooltip_step == 'resources' &&
    _tooltip_progress == 2 &&
    _show_tooltips < 2
  ) {    load_next_tooltip();
  }
  _multi_select.clear();
}
/////////////////////////////////////////////// DEPENDENCIES
function open_dependency_list(parent, task_id, direction) {  display_badge_dd('dependency_' + direction, 'task', task_id, parent, false);
}
function display_dependency_dd(task_id) {  /*
//POSITIONING
box.style.maxHeight="";
box.style.height="";
var left=$id("task_div_"+task_id).offsetLeft*1;
var width=(direction == "back") ? $id("task_div_"+task_id).offsetWidth*1 : 0;
box.style.left=(left+width) +"px";
//ADJUST X POSITION
var scroll_content=$id("tasks");
var far_right=box.offsetLeft*1 + box.offsetWidth*1;
var edge_right=scroll_content.scrollLeft*1 + scroll_content.offsetWidth;
var right_overlap=edge_right - far_right - 10;
if(right_overlap < 0)
{box.style.left=(left+width+right_overlap) +"px";
}
//Y ADJUSTED AFTER CONTENT IS ADDED
*/
  var div=$create('DIV');
  //MAIN CONTENT
  var top=$create('DIV');
  top.className='content';
  div.appendChild(top);
  //HEADER
  top.appendChild($text('Click below to delete dependencies...'));
  //PARENT TASKS
  var left=$create('DIV');
  left.className='left_side';
  top.appendChild(left);
  var parents=get_parents(task_id);
  for (var i=0; i < parents.length; i++) {    if (_tasks[_tasks_key[parents[i]]]) {      var task=_tasks[_tasks_key[parents[i]]];
      var row=$create('DIV');
      row.className='dependency_object';
      row.appendChild($text('(x) ' + task['task_name']));
      row.setAttribute('link_id', task_id);
      row.setAttribute('task_id', task['task_id']);
      row.title=task['task_name'];
      row.onclick=function () {        var cps=new Array();
        var task=_tasks[_tasks_key[this.getAttribute('task_id')]];
        for (var c=0; c < task['critical_paths'].length; c++) {          if (task['critical_paths'][c] != this.getAttribute('link_id')) {            var len=cps.length;
            cps[len]=task['critical_paths'][c];
          } else {            allow_hover=true;
            highlight_row(
              'task',
              this.getAttribute('highlight_task1'),
              'hover_off'
            );
            allow_hover=false;
          }
        }
        task['critical_paths']=cps;
        this.parentNode.removeChild(this);
        load_critical_paths();
        delete_critical_path(
          this.getAttribute('task_id'),
          this.getAttribute('link_id')
        );
        track_segment_event('gantt-deleted-dependency-from-dependency-dot');
      };
      left.appendChild(row);
    }
  }
  //CHILDREN
  var right=$create('DIV');
  right.className='right_side';
  top.appendChild(right);
  var children=_tasks[_tasks_key[task_id]]['critical_paths'];
  for (var i=0; i < children.length; i++) {    if (_tasks[_tasks_key[children[i]]]) {      var task=_tasks[_tasks_key[children[i]]];
      var row=$create('DIV');
      row.className='dependency_object';
      row.appendChild($text('(x) ' + task['task_name']));
      row.setAttribute('link_id', task['task_id']);
      row.setAttribute('task_id', task_id);
      row.title=task['task_name'];
      row.onclick=function () {        var cps=new Array();
        var task=_tasks[_tasks_key[this.getAttribute('task_id')]];
        for (var c=0; c < task['critical_paths'].length; c++) {          if (task['critical_paths'][c] != this.getAttribute('link_id')) {            var len=cps.length;
            cps[len]=task['critical_paths'][c];
          } else {            allow_hover=true;
            highlight_row(
              'task',
              this.getAttribute('highlight_task1'),
              'hover_off'
            );
            allow_hover=false;
          }
        }
        task['critical_paths']=cps;
        this.parentNode.removeChild(this);
        load_critical_paths();
        delete_critical_path(
          this.getAttribute('task_id'),
          this.getAttribute('link_id')
        );
        track_segment_event('gantt-deleted-dependency-from-dependency-dot');
      };
      right.appendChild(row);
    }
  }
  if (parents.length <= 1 && children.length == 0) {    var show_message=true;
    if (parents[0] && parents[0] != '') {      show_message=false;
    }
    if (show_message) {      left.className='hidden';
      right.className='hidden';
      var message=$create('DIV');
      message.className='no_dependencies';
      message.appendChild(
        $text('There are currently no dependencies for this task.')
      );
      top.appendChild(message);
    }
  }
  //CLEAR
  var clear=$create('DIV');
  clear.className='clear';
  top.appendChild(clear);
  //FOOTER
  var footer=$create('DIV');
  footer.className='dependency_dd_footer';
  div.appendChild(footer);
  var d1=$create('DIV');
  d1.appendChild(
    $text(
      '*To create new dependencies, drag the line from the dot to another task.'
    )
  );
  footer.appendChild(d1);
  var learn_more=$create('A');
  learn_more.setAttribute(
    'href',
    'https://support.teamgantt.com/article/8-dependencies/'
  );
  learn_more.setAttribute('target', '_blank');
  learn_more.appendChild($text('Learn more about dependencies'));
  footer.appendChild(learn_more);
  var done=$create('BUTTON');
  done.className='blue_button button_small';
  done.appendChild($text('Done'));
  done.onclick=function () {    const backdrop_cover=document.querySelector('.background_cover') || null;
    if (backdrop_cover) {      backdrop_cover.click();
    }
    hide_backdrop();
  };
  footer.appendChild(done);
  return div;
}
function remove_resource(task_id, resource_type, resource_id, assigned_id) {  delete_task_resource(task_id, assigned_id, function () {    update_resource_inputs(task_id, resource_type, resource_id, '');
    add_task_to_workloads_refresh.add_task(task_id);
  });
}
function add_resource(task_id, resource) {  create_task_resource(task_id, resource, function (response) {    if (response.status === 200) {      var json=JSON.parse(response.responseText);
      update_resource_array(task_id, resource.type, resource.type_id, json.id);
      update_resource_inputs(task_id, resource.type, resource.type_id, json.id);
      add_task_to_workloads_refresh.add_task(task_id);
    }
  });
}
/**
 * Allows the ability to refresh a portion of the workloads view when task assignments are changed.
 * Due to the nature of how the assignment/multi-assignment goes, we're using a queue here that
 * drains one second after the last item on the queue is added. Each time a new item is added to the
 * queue, the one second delay is restarted.
 */
var add_task_to_workloads_refresh=new (function () {  this.task_ids=[];
  this.drainTimeout=null;
  this.add_task=function (id) {    this.task_ids.push(id);
    window.clearTimeout(this.drainTimeout);
    this.drainTimeout=window.setTimeout(this.on_drain.bind(this), 1000);
  };
  this.on_drain=function () {    if (this.task_ids.length > 0) {      var date_range=this.find_date_range(this.task_ids);
      load_resource_schedule(date_range.start_date, date_range.end_date);
    }
    this.task_ids=[];
  };
  this.find_date_range=function (task_ids) {    var response_start=null;
    var response_end=null;
    for (var id of this.task_ids) {      var task=_tasks[_tasks_key[id]];
      var starts=task['start_date'];
      var ends=task['end_date'];
      if (starts === null || ends === null) {        continue;
      }
      if (
        response_start === null ||
        Date.parse(starts) < Date.parse(response_start)
      ) {        response_start=starts;
      }
      if (
        response_end === null ||
        Date.parse(ends) > Date.parse(response_end)
      ) {        response_end=ends;
      }
    }
    return {      start_date: response_start,
      end_date: response_end,
    };
  };
})();
function get_correct_resource_type(type) {  if (type === 'project') {    return 'custom';
  }
  return type;
}
function update_resource_array(taskId, type, typeId, assignedId) {  var resource_type=get_correct_resource_type(type);
  var resource_target =
    _tasks[_tasks_key[taskId]][resource_type + '_resources'][typeId];
  if (!resource_target) {    return;
  }
  resource_target['assigned_id']=assignedId;
}
function update_resource_inputs(taskId, type, typeId, assignedId) {  var resourceType=get_correct_resource_type(type);
  var resourceInput=$id(
    'resource_' + taskId + '_' + resourceType + '_' + typeId
  );
  var resourceAvgHoursInput=$id(
    'resource_avg_hours_' + taskId + '_' + resourceType + '_' + typeId
  );
  if (resourceInput) {    resourceInput.setAttribute('assigned_id', assignedId);
  }
  if (resourceAvgHoursInput) {    resourceAvgHoursInput.setAttribute('assigned_id', assignedId);
    var resourceTotalHoursInput=$id(
      'resource_total_hours_' + taskId + '_' + resourceType + '_' + typeId
    );
    resourceTotalHoursInput.setAttribute('assigned_id', assignedId);
  }}
// JavaScript Document
////// DISPLAY GROUP AND TASK ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function display_project(project, parents) {  //PROJECT META
  if (_has_meta == true) {    var project_meta=$create('DIV');
    project_meta.id='project_meta_' + project['project_id'];
    project_meta.className='project_meta';
    project_meta.setAttribute('project_id', project['project_id']);
    project_meta.onmouseover=function () {      highlight_row('project', this.getAttribute('project_id'), 'hover_on');
    };
    project_meta.onmouseout=function () {      highlight_row('project', this.getAttribute('project_id'), 'hover_off');
    };
    var project_meta_target=$create('DIV');
    project_meta_target.id='project_meta_target_' + project['project_id'];
    project_meta_target.className='project_target';
    parents['meta'].appendChild(project_meta);
    parents['meta'].appendChild(project_meta_target);
    //TIME TRACKING
    if (project['time_tracking'] == 1) {      var time_track=$create('DIV');
      time_track.className='meta_item';
      time_track.innerHTML='&nbsp;';
      project_meta.appendChild(time_track);
    }
    //COMMENT DOCUMENT
    var discussion=comment_document_icon(project);
    if (_show_documents || _show_comments) {      var project_discussion=$create('DIV');
      project_discussion.id =
        'project_meta_discussion_' + project['project_id'];
      project_discussion.className =
        'meta_item has_metric' + (discussion.count > 0 ? ' has_meta' : '');
      insert_icon(project_discussion, discussion.icon);
      var discussion_count=$create('SPAN');
      discussion_count.innerHTML=discussion.count > 0 ? discussion.count : '';
      project_discussion.appendChild(discussion_count);
      project_discussion.onclick=function () {        load_note(
          'project',
          this.parentNode.getAttribute('project_id'),
          'note_viewer',
          this
        );
        track_segment_event('gantt-loaded-discussion-from-project-badge');
      };
      project_meta.appendChild(project_discussion);
    }
    //CHECKLISTS
    var checklist=$create('DIV');
    checklist.className='meta_item has_metric';
    checklist.innerHTML='&nbsp;';
    project_meta.appendChild(checklist);
  }
  //LEFT PANEL
  var project_name=$create('DIV');
  project_name.className='list_project_name';
  project_name.id='project_title_' + project['project_id'];
  project_name.setAttribute('project_id', project['project_id']);
  project_name.onmouseover=function () {    highlight_row('project', this.getAttribute('project_id'), 'hover_on');
  };
  project_name.onmouseout=function () {    highlight_row('project', this.getAttribute('project_id'), 'hover_off');
  };
  var project_name_text=$create('DIV');
  project_name_text.className='project_name';
  project_name_text.appendChild($text(project['project_name']));
  project_name.appendChild(project_name_text);
  if (project['project_permission'] == 'admin' && project['disabled'] == 0) {    var quick=$create('DIV');
    quick.className='quick_controls';
    var q_edit=$create('DIV');
    q_edit.className='quick_edit badge_block';
    q_edit.setAttribute('project_id', project['project_id']);
    insert_icon(q_edit, 'arrow-square-in');
    q_edit.onclick=function () {      edit_project_info(this.getAttribute('project_id'));
      track_segment_event('gantt-opened-edit-project-overlay-from-name-column');
    };
    q_edit.title=_titles['list_project_edit'];
    quick.appendChild(q_edit);
    project_name.insertBefore(quick, project_name.firstChild);
  }
  var project_target=$create('DIV');
  project_target.id='project_target_' + project['project_id'];
  project_target.className='project_target';
  parents['left'].appendChild(project_name);
  parents['left'].appendChild(project_target);
  //ESTIMATED HOURS
  var estimated_hours=$create('DIV');
  estimated_hours.className='estimated_hours';
  estimated_hours.id='project_estimated_hours_' + project['project_id'];
  estimated_hours.appendChild($text(' '));
  project_name.insertBefore(estimated_hours, project_name.firstChild);
  //ACTUAL HOURS
  var actual_hours=$create('DIV');
  actual_hours.className='actual_hours';
  actual_hours.id='actual_hours_' + project['project_id'];
  actual_hours.appendChild($text(' '));
  project_name.insertBefore(actual_hours, project_name.firstChild);
  //ASSIGNED_RESOURCES
  var assigned_resources=$create('DIV');
  assigned_resources.className='assigned_resources';
  assigned_resources.id='project_assigned_resources_' + project['project_id'];
  assigned_resources.appendChild($text(''));
  project_name.insertBefore(assigned_resources, project_name.firstChild);
  //PERCENT COMPLETE
  var span=$create('DIV');
  span.className='percent_complete';
  span.id='project_percent_complete_' + project['project_id'];
  span.appendChild($text('%'));
  project_name.insertBefore(span, project_name.firstChild);
  //RIGHT PANEL
  var project_bar=$create('DIV');
  project_bar.className='project_bar';
  project_bar.id='project_' + project['project_id'];
  project_bar.setAttribute('project_id', project['project_id']);
  project_bar.onmouseover=function () {    highlight_row('project', this.getAttribute('project_id'), 'hover_on');
  };
  project_bar.onmouseout=function () {    highlight_row('project', this.getAttribute('project_id'), 'hover_off');
  };
  parents['right'].appendChild(project_bar);
  //PROJECT BAR
  var project_details=$create('DIV');
  project_details.className='project_in_chart';
  project_details.id='project_div_' + project['project_id'];
  project_details.setAttribute('project_id', project['project_id']);
  project_details.style.marginLeft='-100px';
  project_details.style.width=0 + 'px';
  project_bar.appendChild(project_details);
  //DRAG PROJECT BAR
  if (
    project['disabled'] == 0 &&
    (project['project_permission'] == 'admin' ||
      project['project_permission'] == 'edit')
  ) {    add_multi_select(project_details, 'project', project['project_id']);
  }
  //PROJECT BAR NAMES
  if ($id('show_name_next_to_bar').checked == true) {    var name_bar=$create('DIV');
    name_bar.className='project_name_bar';
    name_bar.appendChild($text(project['project_name']));
    name_bar.id='project_name_next_to_bar_' + project['project_id'];
    project_bar.appendChild(name_bar);
  }
  var project_container=$create('DIV');
  project_container.id='project_bar_target_' + project['project_id'];
  project_container.className='project_target';
  parents['right'].appendChild(project_container);
  var return_array=[];
  return_array['meta']=project_meta_target;
  return_array['left']=project_target;
  return_array['right']=project_container;
  return return_array;
}
function display_group(group, parents, indent) {  var day_width=find_day_width();
  var projects_key=_projects_key[group['project_id']];
  //GROUP META
  if (_has_meta == true) {    var group_meta=$create('DIV');
    group_meta.id='category_meta_' + group['group_id'];
    group_meta.className='group_meta';
    group_meta.setAttribute('group_id', group['group_id']);
    group_meta.onmouseover=function () {      highlight_row('category', this.getAttribute('group_id'), 'hover_on');
    };
    group_meta.onmouseout=function () {      highlight_row('category', this.getAttribute('group_id'), 'hover_off');
    };
    var group_meta_target=$create('DIV');
    group_meta_target.id='category_meta_target_' + group['group_id'];
    group_meta_target.className='group_target';
    parents['meta'].appendChild(group_meta);
    parents['meta'].appendChild(group_meta_target);
    //TIME TRACKING
    if (_projects[_projects_key[group['project_id']]]['time_tracking'] == 1) {      var time_track=$create('DIV');
      time_track.className='meta_item';
      time_track.innerHTML='&nbsp;';
      group_meta.appendChild(time_track);
    }
    //COMMENT DOCUMENT
    var discussion=comment_document_icon(group);
    if (_show_documents || _show_comments) {      var group_discussion=$create('DIV');
      group_discussion.id='group_meta_discussion_' + group['group_id'];
      group_discussion.className =
        'meta_item has_metric' + (discussion.count > 0 ? ' has_meta' : '');
      insert_icon(group_discussion, discussion.icon);
      var discussion_count=$create('SPAN');
      discussion_count.innerHTML=discussion.count > 0 ? discussion.count : '';
      group_discussion.appendChild(discussion_count);
      group_discussion.onclick=function () {        load_note(
          'group',
          this.parentNode.getAttribute('group_id'),
          'note_viewer',
          this
        );
        track_segment_event('gantt-loaded-discussion-from-group-badge');
      };
      group_meta.appendChild(group_discussion);
    }
    //CHECKLISTS
    var checklist=$create('DIV');
    checklist.className='meta_item has_metric';
    checklist.innerHTML='&nbsp;';
    group_meta.appendChild(checklist);
  }
  //LEFT PANEL
  var group_name=$create('DIV');
  group_name.className='category';
  group_name.id='category_title_' + group['group_id'];
  group_name.setAttribute('group_id', group['group_id']);
  group_name.setAttribute('group_hidden', group['group_hidden']);
  group_name.setAttribute('def_hidden', group['group_hidden']);
  group_name.setAttribute('target', 'group');
  group_name.onmouseout=function () {    highlight_row('category', this.getAttribute('group_id'), 'hover_off');
  };
  group_name.onmouseover=function () {    highlight_row('category', this.getAttribute('group_id'), 'hover_on');
  };
  var arrow_wrapper=$create('DIV');
  arrow_wrapper.className='collapse_arrow';
  arrow_wrapper.title =
    group['group_hidden'] != ''
      ? _titles['list_group_collapse2']
      : _titles['list_group_collapse1'];
  arrow_wrapper.onclick=function () {    hide_group_control(this.parentNode.getAttribute('group_id'));
    track_segment_event('gantt-toggled-expand-collapse-group-from-name-column');
  };
  arrow_wrapper.onmousedown=function (e) {    e=e || window.event;
    e.stopPropagation();
  };
  insert_icon(
    arrow_wrapper,
    group['group_hidden'] != '' ? ' triangle-right' : ' triangle-down',
    'group_arrow_' + group['group_id']
  );
  group_name.appendChild(arrow_wrapper);
  if (
    _projects[projects_key]['disabled'] == 0 &&
    (_projects[projects_key]['project_permission'] == 'admin' ||
      _projects[projects_key]['project_permission'] == 'edit')
  ) {    var mover=$create('DIV');
    mover.className='group_mover';
    mover.setAttribute('group_id', group['group_id']);
    mover.onmousedown=function () {      this.setAttribute('mouse_down', 1);
      this.onmousemove();
    };
    mover.onmouseup=function () {      this.setAttribute('mouse_down', 0);
    };
    mover.onclick=function () {      _multi_select.cancel();
    };
    mover.onmousemove=function () {      if (this.getAttribute('mouse_down') == 1) {        _multi_select.clear();
        _multi_select.vdnd_from='left';
        _multi_select.add_group(this.getAttribute('group_id'));
        _multi_select.start('move', 'vertical');
        track_segment_event('gantt-started-group-vdnd-from-name-column');
      }
    };
    mover.title=_titles['list_group_dnd'];
    group_name.appendChild(mover);
  }
  var group_interior=$create('DIV');
  group_interior.className='category_name';
  group_interior.id='list_group_' + group['group_id'];
  group_interior.appendChild($text(group['group_name']));
  if (group['editable'] == true) {    group_interior.title=_titles['list_group_name'];
    group_interior.setAttribute('edit_tag', 'name');
    group_interior.onclick=function () {      inline_edit_group(this);
    };
    group_interior.oncontextmenu=function () {      right_click_menu(this);
      track_segment_event('gantt-opened-right-click-menu-from-group-name');
      return false;
    };
  }
  group_name.appendChild(group_interior);
  if (group['editable'] == true) {    var quick=$create('DIV');
    quick.className='quick_controls';
    var q_edit=$create('DIV');
    q_edit.className='quick_edit badge_block';
    q_edit.setAttribute('group_id', group['group_id']);
    q_edit.onclick=function () {      edit_group_info(this.getAttribute('group_id'));
      track_segment_event('gantt-opened-edit-group-overlay-from-name-column');
    };
    q_edit.title=_titles['list_group_edit'];
    insert_icon(q_edit, 'arrow-square-in');
    quick.appendChild(q_edit);
    var q_delete=$create('DIV');
    q_delete.className='quick_delete badge_block';
    q_delete.setAttribute('group_id', group['group_id']);
    q_delete.title=_titles['list_group_delete'];
    q_delete.onclick=function () {      check_delete_group(
        this.getAttribute('group_id'),
        'gantt-deleted-group-from-name-column'
      );
    };
    insert_icon(q_delete, 'trash');
    quick.appendChild(q_delete);
    var q_cancel=$create('DIV');
    q_cancel.className='quick_cancel badge_block';
    insert_icon(q_cancel, 'remove');
    q_cancel.title='Cancel';
    quick.appendChild(q_cancel);
    insert_quick_add_control(
      quick,
      group['project_id'],
      'group',
      group['group_id']
    );
    group_name.insertBefore(quick, group_name.firstChild);
  }
  var group_target=$create('DIV');
  group_target.id='group_target_' + group['group_id'];
  group_target.setAttribute('group_id', group['group_id']);
  parents['left'].appendChild(group_name);
  parents['left'].appendChild(group_target);
  //ESTIMATED HOURS
  var estimated_hours=$create('DIV');
  estimated_hours.className='estimated_hours';
  estimated_hours.id='group_estimated_hours_' + group['group_id'];
  estimated_hours.appendChild($text(' '));
  group_name.insertBefore(estimated_hours, group_name.firstChild);
  //ACTUAL HOURS
  var actual_hours=$create('DIV');
  actual_hours.className='actual_hours';
  actual_hours.id='group_actual_hours_' + group['group_id'];
  actual_hours.appendChild($text(' '));
  group_name.insertBefore(actual_hours, group_name.firstChild);
  //ASSIGNED_RESOURCES
  var assigned_resources=$create('DIV');
  assigned_resources.className='assigned_resources';
  assigned_resources.id='group_assigned_resources_' + group['group_id'];
  assigned_resources.appendChild($text(''));
  group_name.insertBefore(assigned_resources, group_name.firstChild);
  //PERCENT COMPLETE
  //var perc_complete=(group['total_days'] > 0) ? Math.round((group['completed_days']*1/group['total_days']*1)*100) : 0;
  var perc_complete='~'; // doesn't need to calculate it, as it's figured in the next steop of loading
  var span=$create('DIV');
  span.className='percent_complete';
  span.id='group_percent_complete_' + group['group_id'];
  span.appendChild($text(perc_complete + '%'));
  group_name.insertBefore(span, group_name.firstChild);
  //RIGHT PANEL
  var group_bar=$create('DIV');
  group_bar.id='category_' + group['group_id'];
  group_bar.className='category';
  group_bar.setAttribute('group_id', group['group_id']);
  group_bar.onmouseover=function () {    highlight_row('category', this.getAttribute('group_id'), 'hover_on');
  };
  group_bar.onmouseout=function () {    highlight_row('category', this.getAttribute('group_id'), 'hover_off');
  };
  group_bar.onclick=function () {    unhighlight_all('category', this.getAttribute('group_id'));
  };
  var group_bar_details=$create('DIV');
  group_bar_details.id='category_div_' + group['group_id'];
  group_bar_details.className='category_in_chart radius';
  group_bar_details.className += indent > 0 ? ' indent' : '';
  group_bar_details.setAttribute('group_id', group['group_id']);
  /* BACKGROUND */
  var group_bg=$create('DIV');
  group_bg.className='group_background';
  /* PERCENT COMPLETE */
  var per_complete =
    group['total_days'] > 0
      ? Math.round(
          ((group['completed_days'] * 1) / group['total_days']) * 1 * 100
        )
      : null;
  var percent_complete=$create('DIV');
  percent_complete.className='progress_bar_category';
  percent_complete.style.width=per_complete <= 0 ? 0 : per_complete + '%';
  percent_complete.name='percent_complete';
  if (typeof per_complete != 'number' || per_complete == 0) {    percent_complete.className += ' hidden';
  }
  group_bg.appendChild(percent_complete);
  /* END PERCENT COMPLETE */
  group_bar_details.appendChild(group_bg);
  // Collapse Arrow
  var arrow_wrapper=$create('DIV');
  arrow_wrapper.className='collapse_arrow';
  arrow_wrapper.title =
    group['group_hidden'] != ''
      ? _titles['list_group_collapse2']
      : _titles['list_group_collapse1'];
  arrow_wrapper.onclick=function () {    hide_group_control(this.parentNode.getAttribute('group_id'));
    track_segment_event('gantt-toggled-expand-collapse-group-from-group-bar');
  };
  arrow_wrapper.onmousedown=function (e) {    e=e || window.event;
    e.stopPropagation();
  };
  var arrow=insert_icon(
    arrow_wrapper,
    group['group_hidden'] != '' ? ' triangle-right' : ' triangle-down',
    'group_chart_arrow_' + group['group_id']
  );
  group_bar_details.appendChild(arrow_wrapper);
  //APPEND THE BAR
  group_bar.appendChild(group_bar_details);
  //IF GROUP IS EDITABLE
  if (
    group['editable'] == true ||
    $id('show_name_next_to_bar').checked == true
  ) {    var badges=$create('DIV');
    badges.style.left=0;
    badges.className='badges blue2';
    badges.setAttribute('group_id', group['group_id']);
    badges.setAttribute('is_badge', 1);
    badges.id='group_badge_' + group['group_id'];
    group_bar.appendChild(badges);
    if (group['editable'] == true) {      add_multi_select(group_bar_details, 'group', group['group_id']);
      var edit_menu=$create('DIV');
      edit_menu.className='edit_menu';
      edit_menu.setAttribute('group_id', group['group_id']);
      badges.appendChild(edit_menu);
      //EDIT GROUP
      var edit_option=$create('DIV');
      edit_option.className='badge_block';
      edit_option.onclick=function () {        edit_group_info(this.parentNode.getAttribute('group_id'));
        track_segment_event('gantt-opened-edit-group-overlay-from-gantt-icon');
      };
      edit_option.title=_titles['gantt_group_edit'];
      insert_icon(edit_option, 'arrow-square-in');
      edit_menu.appendChild(edit_option);
      //COLORS
      var change_color=$create('DIV');
      change_color.className='badge_block edit_color';
      change_color.setAttribute('group_id', group['group_id']);
      change_color.id='group_color_' + group['group_id'];
      change_color.title=_titles['gantt_group_color'];
      change_color.onclick=function () {        display_badge_dd(
          'color',
          'group',
          this.getAttribute('group_id'),
          this,
          false
        );
        track_segment_event('gantt-opened-group-color-picker-from-gantt-icon');
      };
      var color=$create('SPAN');
      color.className='color_badge';
      change_color.appendChild(color);
      edit_menu.appendChild(change_color);
      insert_quick_add_control(
        edit_menu,
        group['project_id'],
        'group',
        group['group_id']
      );
    }
    //GROUP BAR NAMES
    if ($id('show_name_next_to_bar').checked == true) {      var name_bar=$create('DIV');
      name_bar.className='badge_group_name_bar';
      name_bar.appendChild($text(group['group_name']));
      name_bar.id='group_name_next_to_bar_' + group['group_id'];
      badges.appendChild(name_bar);
    }
  }
  var group_bar_target=$create('DIV');
  group_bar_target.id='group_bar_target_' + group['group_id'];
  parents['right'].appendChild(group_bar);
  parents['right'].appendChild(group_bar_target);
  if (indent > 0) {    arrow.style.left=indent + 'em';
    group_name.style.paddingLeft=indent + 'em';
    //meta
    if (_has_meta == true) {      group_meta.className += ' indent';
    }
    group_name.className += ' indent'; //left
    group_bar.className += ' indent'; //right
  }
  if (group['visible'] == false) {    //meta
    if (_has_meta == true) {      group_meta.className='hidden';
      group_meta_target.className='hidden';
    }
    group_name.className='hidden'; //left
    group_target.className='hidden'; //left
    group_bar.className='hidden'; //right
    group_bar_target.className='hidden'; //right
  }
  return [
    group_meta,
    group_meta_target,
    group_name,
    group_target,
    group_bar,
    group_bar_target,
  ];
}
function is_pending_task(id) {  return id.indexOf('new-task') > -1;
}
function set_save_do_focus(ele) {  _tasks[_tasks_key[ele.getAttribute('task_id')]]['save_do_focus']=ele;
}
function display_tasks(task, group_targets) {  var day_width=_day_width[$id('zoom').value];
  var projects_key=_projects_key[task['project_id']];
  //TASK META
  if (_has_meta == true) {    var task_meta=$create('DIV');
    task_meta.id='task_meta_' + task['task_id'];
    task_meta.className='task_meta';
    if (is_pending_task(task['task_id'])) {      task_meta.classList.add('pending');
    }
    task_meta.setAttribute('task_id', task['task_id']);
    task_meta.onmouseover=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_on');
    };
    task_meta.onmouseout=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_off');
    };
    //TIME TRACKING
    if (_projects[_projects_key[task['project_id']]]['time_tracking'] == 1) {      var time_track=$create('DIV');
      time_track.id='track_time_' + task['task_id'];
      time_track.className='meta_item';
      time_track.setAttribute('task_id', task['task_id']);
      time_track.setAttribute('project_id', task['project_id']);
      insert_icon(time_track, 'clock-outline');
      time_track.onclick=function () {        open_time_tracking_meta(this);
        track_segment_event('gantt-opened-time-tracking-in-task-badge');
      };
      time_track.title='Click to Track Time';
      task_meta.appendChild(time_track);
      //IF HAS TIME
      var shouldHaveIcon=task['has_time'] == 1 || task['punched_in'] == 1;
      time_track.className += shouldHaveIcon ? ' has_meta' : '';
      time_track.className +=
        task['user_punched_in'] == 1 ? ' user_punched_in' : '';
    }
    //COMMENT DOCUMENT
    var discussion=comment_document_icon(task);
    if (_show_documents || _show_comments) {      var task_discussion=$create('DIV');
      task_discussion.id='task_meta_discussion_' + task['task_id'];
      task_discussion.className =
        'meta_item has_metric' + (discussion.count > 0 ? ' has_meta' : '');
      insert_icon(task_discussion, discussion.icon);
      var discussion_count=$create('SPAN');
      discussion_count.innerHTML=discussion.count > 0 ? discussion.count : '';
      task_discussion.appendChild(discussion_count);
      task_discussion.onclick=function () {        load_note(
          'task',
          this.parentNode.getAttribute('task_id'),
          'note_viewer',
          this
        );
        track_segment_event('gantt-loaded-discussion-from-task-badge');
      };
      task_meta.appendChild(task_discussion);
    }
    //CHECKLIST
    var task_checklist=$create('DIV');
    task_checklist.id='task_meta_checklist_' + task['task_id'];
    task_checklist.className =
      'meta_item has_metric' + (task['checklist_count'] > 0 ? ' has_meta' : '');
    insert_icon(task_checklist, 'checklist');
    var checklist_count=$create('SPAN');
    checklist_count.innerHTML =
      task['checklist_count'] > 0
        ? task['checklist_completed'] + '/' + task['checklist_count']
        : '';
    task_checklist.appendChild(checklist_count);
    task_checklist.onclick=function () {      load_checklist(
        'task',
        this.parentNode.getAttribute('task_id'),
        'note_viewer',
        this
      );
      track_segment_event('gantt-loaded-checklists-task-badge');
    };
    task_meta.appendChild(task_checklist);
    if (task['show_task'] == false) {      task_meta.style.display='none';
      task_meta.setAttribute('task_hidden', 1);
    }
    group_targets['meta'].appendChild(task_meta);
  }
  //LEFT PANEL
  var task_name=$create('DIV');
  task_name.id='task_title_' + task['task_id'];
  task_name.setAttribute('task_id', task['task_id']);
  task_name.className='task';
  if (is_pending_task(task['task_id'])) {    task_name.classList.add('pending');
  }
  task_name.onmouseover=function () {    highlight_row('task', this.getAttribute('task_id'), 'hover_on');
  };
  task_name.onmouseout=function () {    highlight_row('task', this.getAttribute('task_id'), 'hover_off');
  };
  if (task['show_task'] == false) {    task_name.style.display='none';
    task_name.setAttribute('task_hidden', 1);
  }
  var show_mover=false;
  if (
    _projects[projects_key]['disabled'] == 0 &&
    (_projects[projects_key]['project_permission'] == 'admin' ||
      _projects[projects_key]['project_permission'] == 'edit')
  ) {    var mover=$create('DIV');
    mover.className='task_mover';
    mover.setAttribute('task_id', task['task_id']);
    mover.onmousedown=function () {      this.setAttribute('mouse_down', 1);
    };
    mover.onmouseup=function () {      this.setAttribute('mouse_down', 0);
    };
    mover.onclick=function () {      _multi_select.cancel();
    };
    mover.onmousemove=function () {      disableSelection(this, 'row-resize');
      if (this.getAttribute('mouse_down') == 1) {        _multi_select.clear();
        _multi_select.vdnd_from='left';
        _multi_select.add('task', this.getAttribute('task_id'), false, true);
        _multi_select.start('move', 'vertical');
        this.setAttribute('mouse_down', 0);
        track_segment_event('gantt-started-task-vdnd-from-name-column');
      }
    };
    mover.title=_titles['list_task_dnd'];
    task_name.appendChild(mover);
    show_mover=true;
  }
  var task_interior=$create('DIV');
  task_interior.className=generate_editable_class_name(
    'task_name',
    task['editable']
  );
  task_interior.id='task_name_' + task['task_id'];
  task_interior.setAttribute('task_id', task['task_id']);
  task_interior.appendChild($text(task['task_name']));
  task_interior.onmouseover=function () {    this.title=_tasks[_tasks_key[this.getAttribute('task_id')]]['task_name'];
  };
  if (task['editable'] == 1) {    task_interior.setAttribute('edit_tag', 'name');
    task_interior.onmousedown=function (e) {      // prevent editing task name while we're still creating it
      if (is_pending_task(this.getAttribute('task_id'))) {        return;
      }
      e=e || event;
      if (e.button == 2) {        return false;
      } else {        inline_edit_task(this, true);
      }
    };
    task_interior.oncontextmenu=function () {      if (is_pending_task(this.getAttribute('task_id'))) {        return;
      }
      if (this.getAttribute('contenteditable') == null) {        right_click_menu(this);
        track_segment_event('gantt-opened-right-click-menu-from-task-name');
        return false;
      }
    };
  }
  task_name.appendChild(task_interior);
  var quick=$create('DIV');
  quick.className='quick_controls';
  if (task['editable'] == 1 || _is_iframe_view == false) {    var q_edit=$create('DIV');
    q_edit.className='quick_edit badge_block';
    q_edit.setAttribute('task_id', task['task_id']);
    q_edit.setAttribute('task_type', task['task_type'].toLowerCase());
    insert_icon(q_edit, 'arrow-square-in');
    q_edit.onclick=function () {      edit_task_info(this.getAttribute('task_id'));
      track_segment_event('gantt-opened-edit-task-overlay-from-name-column');
    };
    q_edit.title=_titles['list_task_edit'];
    quick.appendChild(q_edit);
  }
  if (task['editable'] == 1) {    var q_delete=$create('DIV');
    q_delete.className='quick_delete badge_block';
    q_delete.setAttribute('task_id', task['task_id']);
    insert_icon(q_delete, 'trash');
    q_delete.onclick=function () {      var task_name =
        _tasks[_tasks_key[this.getAttribute('task_id')]]['task_name'];
      var conf_message =
        'Are you sure you want to delete "' +
        task_name.replace(/</g, '&lt;') +
        '"?';
      var external_app =
        _projects[
          _projects_key[
            _tasks[_tasks_key[this.getAttribute('task_id')]]['project_id']
          ]
        ]['integration_app'];
      if (external_app != '') {        conf_message =
          'Deleting this task will delete the task in ' +
          external_app +
          '. ' +
          conf_message;
      }
      var conf=custom_confirm(conf_message);
      conf['yes'].setAttribute('task_id', this.getAttribute('task_id'));
      conf['yes'].onclick=function () {        this.ondblclick();
        save_value('remove_task', this.getAttribute('task_id'), -1);
        track_segment_event('gantt-deleted-task-from-name-column');
      };
    };
    q_delete.title=_titles['list_task_delete'];
    quick.appendChild(q_delete);
    var q_cancel=$create('DIV');
    q_cancel.className='quick_cancel badge_block';
    insert_icon(q_cancel, 'remove');
    q_cancel.title='Cancel';
    quick.appendChild(q_cancel);
  }
  insert_quick_add_control(quick, task['project_id'], 'task', task['task_id']);
  task_name.insertBefore(quick, task_name.firstChild);
  //INDENT
  var indent=_groups[_groups_key[task['group_id']]]['indent'];
  task_interior.style.marginLeft=indent + 'em';
  group_targets['left'].appendChild(task_name);
  //ESTIMATED HOURS
  var hours_column=$create('DIV');
  hours_column.className='estimated_hours';
  task_name.insertBefore(hours_column, task_name.firstChild);
  //HOURS INPUT
  if (
    _projects[_projects_key[task['project_id']]]['project_enable_hours'] == 1
  ) {    var hours_input=$create('DIV');
    hours_input.id='task_estimated_hours_' + task['task_id'];
    hours_input.setAttribute('task_id', task['task_id']);
    hours_input.appendChild(
      $text(
        task['estimated_hours'] == '' || isNaN(task['estimated_hours'])
          ? 0
          : task['estimated_hours'] * 1
      )
    );
    hours_input.className=generate_editable_class_name(
      null,
      task['editable']
    );
    if (task['editable'] == 1) {      hours_input.setAttribute('contenteditable', true);
      hours_input.onfocus=function () {        highlight_row('task', this.getAttribute('task_id'), 'hover_on');
        highlight_row('task', this.getAttribute('task_id'), 'editing_row');
        allow_hover=false;
      };
      hours_input.onkeyup=function (event) {        e=event;
        if (e.keyCode == _master_keys['esc']) {          this.firstChild.nodeValue =
            _tasks[_tasks_key[this.getAttribute('task_id')]]['estimated_hours'];
          this.blur();
        } else if (e.keyCode == _master_keys['enter']) {          this.blur();
        }
      };
      hours_input.onblur=function () {        cleanup_editable_div(this);
        this.firstChild.nodeValue=isNaN(this.firstChild.nodeValue)
          ? 0
          : Math.round(this.firstChild.nodeValue * 100) / 100;
        //SAVE IT
        if (
          this.firstChild.nodeValue !=
          _tasks[_tasks_key[this.getAttribute('task_id')]]['estimated_hours'] *
            1
        ) {          save_task_assigned_hours(
            this.getAttribute('task_id'),
            this.firstChild.nodeValue
          );
          //UPDATE CHART
          _tasks[_tasks_key[this.getAttribute('task_id')]]['estimated_hours'] =
            this.firstChild.nodeValue;
          update_group_bar();
          display_actual_hours_bar(this.getAttribute('task_id'));
          track_segment_event(
            'gantt-modified-hours-from-estimated-hours-column'
          );
        } else {          if (this.getAttribute('do_tab') != null) {            click_selected_field(_after_save_ele);
            _after_save_ele=null;
          }
        }
        this.removeAttribute('do_tab');
        clear_text();
        allow_hover=true;
        unhighlight_all();
      };
      hours_input.onkeydown=function (event) {        e=event;
        if (e.keyCode == _master_keys['tab']) {          this.setAttribute('do_tab', 1);
          _after_save_ele=select_field(this.getAttribute('task_id'), this);
          this.blur();
          return false;
        } else if (e.keyCode == _master_keys['enter']) {          clear_text();
          setTimeout(function () {            this.blur();
          }, 100);
          return false;
        }
      };
      hours_input.onclick=function () {        if (is_pending_task(this.id)) {          set_save_do_focus(this);
          return;
        }
        this.focus();
        document.execCommand('selectAll', false, null);
      };
    }
    hours_column.appendChild(hours_input);
  }
  //ACTUAL HOURS
  var actual_hours_column=$create('DIV');
  actual_hours_column.className='actual_hours';
  actual_hours_column.id='task_actual_hours_' + task['task_id'];
  var actual_hours =
    _projects[_projects_key[task['project_id']]]['time_tracking'] == 1
      ? task['actual_hours'] * 1
      : '';
  actual_hours_column.appendChild($text(actual_hours));
  task_name.insertBefore(actual_hours_column, task_name.firstChild);
  //ASSIGNED_RESOURCES
  var assigned_resources=$create('DIV');
  assigned_resources.className='assigned_resources';
  task_name.insertBefore(assigned_resources, task_name.firstChild);
  var assigned_resources_wrapper=$create('DIV');
  assigned_resources_wrapper.className=generate_editable_class_name(
    'assigned_resources_wrapper',
    task['editable']
  );
  assigned_resources.appendChild(assigned_resources_wrapper);
  //RESOURCE LIST
  var task_assigned_resources=$create('DIV');
  task_assigned_resources.id='task_assigned_resources_' + task['task_id'];
  task_assigned_resources.className=generate_editable_class_name(
    null,
    task['editable']
  );
  task_assigned_resources.setAttribute('task_id', task['task_id']);
  if (task['editable'] == 1) {    task_assigned_resources.onclick=function () {      if (is_pending_task(this.id)) {        set_save_do_focus(this);
        return;
      }
      highlight_row('task', this.getAttribute('task_id'), 'hover_on');
      highlight_row('task', this.getAttribute('task_id'), 'editing_row');
      var bg=build_background_cover();
      bg.onclick=function () {        hide_backdrop();
        if ($id('people_assigned_column_edit_resources')) {          $id('people_assigned_column_edit_resources').setAttribute('keep', 0);
          $id('people_assigned_column_edit_resources').setAttribute(
            'mouse_over',
            0
          );
          check_close_badge_dd('people_assigned_column_edit_resources', 0);
        }
      };
      var task_id=this.getAttribute('task_id');
      var badge_dd=display_badge_dd('resources', 'task', task_id, null, true);
      badge_dd.id='people_assigned_column_edit_resources';
      badge_dd.className += ' extra_classes';
      document.body.appendChild(badge_dd);
      badge_dd.getElementsByTagName('INPUT')[0].focus();
      var left=0;
      left += $id('task_assigned_resources_' + task_id).offsetLeft; // how far left the resource column is on the left side
      left += $id('category_task_list').offsetLeft; // covers meta column width (sometimes it doesn't exist)
      left += sidebar_width() * 1; // sidebar width
      left += badge_dd.offsetWidth / 2 - 50; // half of the resource overlay minus 50 px to slide it left a little (looks nicer this way)
      left=Math.round(left);
      var top=0;
      top += $id('task_title_' + task_id).offsetTop; // how far from the top of the gantt is the current row
      top += $id('header').offsetHeight; // account for header height
      top += $id('underbar').offsetHeight; // account for underbar height
      top += $id('task_header').offsetTop; // account for task header margin top
      top -= $id('background_lines').offsetTop; // used to determine how far down we're scrolled
      badge_dd.style.top=top + 'px';
      badge_dd.style.left=left + 'px';
      update_resource_search_height(badge_dd);
      //MOVE UP IF NEEDED
      var page_bottom=document.body.scrollTop * 0 + window.innerHeight * 1;
      var badge_bottom =
        badge_dd.offsetTop * 1 + badge_dd.offsetHeight * 1 + 15;
      if (page_bottom < badge_bottom) {        top += page_bottom - badge_bottom;
        badge_dd.style.top=top + 'px';
      }
      track_segment_event('gantt-opened-task-assign-from-assign-column');
    };
  }
  assigned_resources_wrapper.appendChild(task_assigned_resources);
  //IF HOURS DON'T MATCH
  if (
    task['resources'].length > 0 &&
    task['estimated_hours'] != task['assigned_hours'] &&
    _projects[_projects_key[task['project_id']]]['project_enable_hours'] == 1
  ) {    assigned_resources.className += ' error';
  }
  //PERCENT COMPLETE
  var task_details=$create('DIV');
  task_details.className='percent_complete';
  if (task['task_type'] == 'Task') {    if (task['editable'] == 1 || task['edit_percent'] == 1) {      var percent=$create('DIV');
      percent.setAttribute('contenteditable', true);
      percent.id='task_percent_input_' + task['task_id'];
      percent.className='editable';
      percent.setAttribute('task_id', task['task_id']);
      percent.setAttribute('group_id', task['group_id']);
      percent.setAttribute('edit_tag', 'percent');
      percent.setAttribute('percent_complete', task['percent_complete']);
      percent.setAttribute('allow_arrows', 1);
      percent.title=_titles['task_percent_complete'];
      percent.appendChild($text(task['percent_complete'] + '%'));
      percent.onfocus=function () {        highlight_row('task', this.getAttribute('task_id'), 'hover_on');
        highlight_row('task', this.getAttribute('task_id'), 'editing_row');
        allow_hover=false;
      };
      percent.onkeyup=function (event) {        e=event;
        if (e.keyCode == _master_keys['esc']) {          this.firstChild.nodeValue =
            _tasks[_tasks_key[this.getAttribute('task_id')]][
              'percent_complete'
            ] + '%';
          this.blur();
        }
      };
      percent.onkeydown=function (event) {        e=event;
        if (e.keyCode == _master_keys['enter']) {          this.blur();
          return false;
        } else if (e.keyCode == _master_keys['tab']) {          this.blur();
          click_selected_field(
            select_field(this.getAttribute('task_id'), this)
          );
          return false;
        }
      };
      percent.onblur=function () {        cleanup_editable_div(this);
        var value=this.firstChild.nodeValue;
        value=value < 0 ? 0 : value;
        value=value > 100 ? 100 : value;
        if (value == '') {          value=0;
          var prog_bar=$id(
            'task_div_' + this.getAttribute('task_id')
          ).firstChild;
          prog_bar.className='progress_bar hidden';
          prog_bar.style.width=0;
        }
        if (
          _tasks[_tasks_key[this.getAttribute('task_id')]] &&
          value !=
            _tasks[_tasks_key[this.getAttribute('task_id')]]['percent_complete']
        ) {          var task_name =
            _tasks[_tasks_key[this.getAttribute('task_id')]]['task_name'];
          save_value(
            'percent_complete',
            this.getAttribute('task_id'),
            value,
            '&name=' + task_name
          );
          _tasks[_tasks_key[this.getAttribute('task_id')]]['percent_complete'] =
            value;
          track_segment_event(
            'gantt-modified-percent-complete-from-progress-column'
          );
        }
        this.setAttribute('percent_complete', value);
        this.firstChild.nodeValue=value + '%';
        update_task_percent_complete(this);
        clear_text();
        update_group_bar();
        allow_hover=true;
        unhighlight_all();
      };
      percent.onmousedown=function () {        if (_multi_select.in_selection) {          _multi_select.clear();
          _multi_select.done();
        }
      };
      percent.onclick=function () {        if (is_pending_task(this.id)) {          set_save_do_focus(this);
          return;
        }
        this.focus();
        document.execCommand('selectAll', false, null);
      };
      task_details.appendChild(percent);
    } else {      var percent=$create('DIV');
      percent.appendChild($text(task['percent_complete']));
      task_details.appendChild(percent);
    }
  } else if (task['task_type'] == 'Milestone') {    if (task['editable'] == 1 || task['edit_percent'] == 1) {      var span=$create('SPAN');
      span.className='hidden';
      var checkbox=$create('INPUT');
      checkbox.type='checkbox';
      checkbox.title='Edit Percent Complete';
      checkbox.id='task_percent_input_' + task['task_id'];
      checkbox.value=task['percent_complete'];
      checkbox.setAttribute('task_id', task['task_id']);
      checkbox.setAttribute('group_id', task['group_id']);
      checkbox.checked=task['percent_complete'] == 100 ? true : false;
      checkbox.className='hidden';
      span.appendChild(checkbox);
      var div=$create('DIV');
      div.className='milestone_checkbox';
      if (task['percent_complete'] == 100) {        div.className += ' milestone_complete';
        insert_icon(div, 'check');
      }
      div.setAttribute('task_id', task['task_id']);
      div.id='task_percent_input_div_' + task['task_id'];
      div.onclick=function () {        var box=$id('task_percent_input_' + this.getAttribute('task_id'));
        box.checked=box.checked == false ? true : false; //this will check the box
        box.value=box.checked == true ? 100 : 0;
        _tasks[_tasks_key[this.getAttribute('task_id')]]['percent_complete'] =
          box.value;
        if (box.checked) {          insert_icon(div, 'check');
        } else {          div.removeChild(div.firstChild);
        }
        save_value('percent_complete', box.getAttribute('task_id'), box.value);
        track_segment_event('gantt-modified-milestone-from-progress-column');
        clear_text();
        update_group_bar();
        //UPDATE THE MILESTONE ICON
        var ele1=$id('task_div_' + box.getAttribute('task_id'));
        var ele2=$id('task_percent_input_div_' + box.getAttribute('task_id'));
        if (box.value == 100) {          if (ele1.className.indexOf('complete') == -1) {            ele1.className += ' complete';
          }
          if (ele2.className.indexOf('milestone_complete') == -1) {            ele2.className += ' milestone_complete';
          }
        } else {          ele1.className=ele1.className.replace(/complete/g, '');
          ele2.className=ele2.className.replace(/milestone_complete/g, '');
        }
      };
      task_details.appendChild(span);
      task_details.appendChild(div);
    } else {      var div=$create('DIV');
      div.className='milestone_checkbox';
      if (task['percent_complete'] == 100) {        div.className += ' milestone_complete';
        insert_icon(div, 'check');
      }
      div.setAttribute('task_id', task['task_id']);
      div.id='task_percent_input_div_' + task['task_id'];
      task_details.appendChild(div);
    }
  }
  task_name.insertBefore(task_details, task_name.firstChild);
  //RIGHT PANEL
  var task_bar=$create('DIV');
  task_bar.id='task_' + task['task_id'];
  task_bar.className='task';
  if (is_pending_task(task['task_id'])) {    task_bar.classList.add('pending');
  }
  task_bar.setAttribute('task_id', task['task_id']);
  task_bar.onmouseover=function () {    highlight_row('task', this.getAttribute('task_id'), 'hover_on');
  };
  task_bar.onmouseout=function () {    highlight_row('task', this.getAttribute('task_id'), 'hover_off');
  };
  if (task['show_task'] == false) {    task_bar.style.display='none';
    task_bar.setAttribute('task_hidden', 1);
  }
  group_targets['right'].appendChild(task_bar);
  if (true || task['total_days'] > 0) {    var task_bar_details=$create('DIV');
    task_bar_details.id='task_div_' + task['task_id'];
    task_bar_details.className =
      task['task_type'] == 'Task'
        ? 'task_in_chart radius'
        : 'milestone_in_chart';
    task_bar_details.className +=
      task['color'] != '' ? ' ' + task['color'] : '';
    if (task['task_type'] == 'Milestone') {      task_bar_details.className +=
        task['percent_complete'] == 100 ? ' complete' : '';
      var milestone_icon=$create('DIV');
      milestone_icon.className='milestone';
      task_bar_details.appendChild(milestone_icon);
    }
    task_bar_details.style.position='absolute';
    task_bar_details.setAttribute('task_id', task['task_id']);
    task_bar_details.setAttribute('category_id', task['group_id']);
    task_bar_details.onmouseover=function () {      if (_is_building == 1) {        _cp_build_task=this.getAttribute('task_id');
        this.title='';
      } else if (_multi_select.in_action == true) {        this.title='';
      } else {        if (
          _tasks[_tasks_key[this.getAttribute('task_id')]]['start_date'] != ''
        ) {          this.title =
            clean_date(
              _tasks[_tasks_key[this.getAttribute('task_id')]]['start_date']
            ) +
            ' to ' +
            clean_date(
              _tasks[_tasks_key[this.getAttribute('task_id')]]['end_date']
            );
        } else {          this.title='';
        }
      }
      if (_multi_select.move_direction == 'vertical') {        highlight_row(
          this.getAttribute('type'),
          this.getAttribute('type_id'),
          'moving_highlight'
        );
      }
    };
    task_bar_details.onmouseout=function () {      _cp_build_task=null;
    };
    //HOW FAR LEFT TO PLACE IT & HOW LONG
    var pos=find_position(task['start_date'], task['end_date'], day_width);
    var left=pos[0];
    task_bar_details.style.marginLeft=left + 'px';
    task_bar_details.style.left=0;
    task_bar_details.setAttribute('def_left', left);
    task_bar_details.setAttribute('var_left', left);
    //var task_width=(task['task_type'] == "Task") ? pos[1] : 13;
    task_width=pos[1] + 2; // add 2px to cover the size that the border used to take
    task_bar_details.style.width=task_width + 'px';
    task_bar_details.setAttribute('def_width', task_width);
    task_bar_details.setAttribute('var_width', task_width);
    //SET THE ARRAY's VALUES
    _tasks[_tasks_key[task['task_id']]]['var_left']=left;
    _tasks[_tasks_key[task['task_id']]]['def_left']=left;
    _tasks[_tasks_key[task['task_id']]]['var_width']=task_width;
    _tasks[_tasks_key[task['task_id']]]['def_width']=task_width;
    task_bar.appendChild(task_bar_details);
    //IF 0 DAYS
    if (task['total_days'] == 0 && task['editable'] == 1) {      task_bar_details.style.marginLeft='-200px';
      task_bar.setAttribute('nodate', 'true');
      task_bar.onmousedown=function () {        if (_draw_task_allow) {          _draw_task=this.getAttribute('task_id');
          start_move('task_draw');
        }
      };
      //CAPTION BAR
      var caption=$create('DIV');
      caption.className='task_bar_details_caption radius';
      var caption_arrow=$create('DIV');
      caption_arrow.className='task_bar_details_caption_arrow';
      caption.appendChild(caption_arrow);
      caption.appendChild($text('Click and drag to set date'));
      task_bar_details.appendChild(caption);
    }
    //PERCENT COMPLETE BAR
    var percent_complete=$create('DIV');
    percent_complete.className =
      task['percent_complete'] != 0 && task['task_type'] == 'Task'
        ? 'progress_bar radius'
        : 'progress_bar hidden';
    percent_complete.style.width=task['percent_complete'] + '%';
    task_bar_details.appendChild(percent_complete);
    //SHOW TASK NAME IN BAR
    if (
      $id('show_name_in_bar').checked == true &&
      task['task_type'] == 'Task'
    ) {      var name_bar=$create('DIV');
      name_bar.className='task_name_bar';
      var span=$create('SPAN');
      span.appendChild($text(task['task_name']));
      span.id='task_name_bar_' + task['task_id'];
      name_bar.appendChild(span);
      task_bar_details.appendChild(name_bar);
      disableSelection(name_bar);
    }
    //TASK BAR MOVER
    task_bar_details.ondblclick=function () {      edit_task_info(this.parentNode.getAttribute('task_id'));
    };
    //BADGES
    var badges=$create('DIV');
    badges.style.marginLeft=left * 1 + task_width + 2 + 'px';
    badges.style.left=0;
    badges.className='badges ' + task['color'];
    badges.setAttribute('task_id', task['task_id']);
    badges.setAttribute('is_badge', 1);
    badges.id='task_badge_' + task['task_id'];
    task_bar.appendChild(badges);
    if (task['editable'] == 1) {      var cp_front_move=30;
      var cp_back_move=6;
      /*
-- 1. "front_minus" attribute is for elements that appear before the task bar. it is used for when a task bar is moved and how far to place it beyond the length of the bar.
*/
      var cp_badge_front=$create('DIV');
      cp_badge_front.className='cp_create_front cp_create';
      cp_badge_front.id='dependency_front_' + task['task_id'];
      cp_badge_front.setAttribute('task_id', task['task_id']);
      cp_badge_front.style.marginLeft =
        '-' + (task_width * 1 + cp_front_move) + 'px';
      cp_badge_front.setAttribute('front_minus', cp_front_move);
      var dot=$create('SPAN');
      dot.className='dot';
      cp_badge_front.appendChild(dot);
      cp_badge_front.onmousedown=function () {        this.setAttribute('mousedown', 1);
      };
      cp_badge_front.onmouseup=function () {        this.setAttribute('mousedown', 0);
      };
      cp_badge_front.onmouseout=function () {        this.setAttribute('mousedown', 0);
      };
      cp_badge_front.onmousemove=function () {        if (this.getAttribute('mousedown') == 1) {          start_build_new_cp('to', this.getAttribute('task_id'));
          track_segment_event(
            'gantt-started-dependency-from-start-of-task-bar'
          );
        }
      };
      cp_badge_front.onclick=function () {        this.setAttribute('mousedown', 0);
        open_dependency_list(this, this.getAttribute('task_id'), 'front');
        track_segment_event('gantt-clicked-dependency-dot');
        return false;
      };
      cp_badge_front.oncontextmenu=function () {        this.setAttribute('mousedown', 0);
        open_dependency_list(this, this.getAttribute('task_id'), 'front');
        track_segment_event('gantt-clicked-dependency-dot');
        return false;
      };
      cp_badge_front.title=_titles['gantt_task_cp'];
      badges.appendChild(cp_badge_front);
      if (task['task_type'] == 'Task') {        var extend_front=$create('DIV');
        extend_front.className='extend extend_front';
        extend_front.setAttribute('task_id', task['task_id']);
        extend_front.style.marginLeft='-' + (task_width * 1 + 11) + 'px';
        extend_front.setAttribute('front_minus', 11);
        extend_front.onmousedown=function () {          _multi_select.add('task', this.getAttribute('task_id'));
          _multi_select.start('move', 'extend_front');
        };
        extend_front.title=_titles['gantt_task_extend_front'];
        var line=$create('DIV');
        line.className='extend_line';
        extend_front.appendChild(line);
        badges.appendChild(extend_front);
        var extend_back=$create('DIV');
        extend_back.className='extend extend_back';
        extend_back.setAttribute('task_id', task['task_id']);
        extend_back.onmousedown=function () {          _multi_select.add('task', this.getAttribute('task_id'));
          _multi_select.start('move', 'extend_back');
        };
        extend_back.title=_titles['gantt_task_extend_back'];
        var line=$create('DIV');
        line.className='extend_line';
        extend_back.appendChild(line);
        badges.appendChild(extend_back);
      }
      var cp_badge=$create('DIV');
      cp_badge.className='cp_create_back cp_create';
      cp_badge.id='dependency_back_' + task['task_id'];
      cp_badge.setAttribute('task_id', task['task_id']);
      cp_badge.style.marginLeft=cp_back_move + 'px';
      var dot=$create('SPAN');
      dot.className='dot';
      cp_badge.appendChild(dot);
      cp_badge.onmousedown=function () {        this.setAttribute('mousedown', 1);
      };
      cp_badge.onmouseup=function () {        this.setAttribute('mousedown', 0);
      };
      cp_badge.onmouseout=function () {        this.setAttribute('mousedown', 0);
      };
      cp_badge.onmousemove=function () {        if (this.getAttribute('mousedown') == 1) {          start_build_new_cp('from', this.getAttribute('task_id'));
          track_segment_event('gantt-started-dependency-from-end-of-task-bar');
        }
      };
      cp_badge.onclick=function () {        this.setAttribute('mousedown', 0);
        open_dependency_list(this, this.getAttribute('task_id'), 'back');
        track_segment_event('gantt-clicked-dependency-dot');
        return false;
      };
      cp_badge.oncontextmenu=function () {        this.setAttribute('mousedown', 0);
        open_dependency_list(this, this.getAttribute('task_id'), 'back');
        track_segment_event('gantt-clicked-dependency-dot');
        return false;
      };
      cp_badge.title='click and drag to another task to create dependency.';
      badges.appendChild(cp_badge);
    }
    var edit_task=$create('DIV');
    edit_task.className='edit_menu';
    edit_task.setAttribute('task_id', task['task_id']);
    //EDIT TASK AND RESOURCES
    if (task['editable'] == 1) {      //EDIT TASK
      var edit_option=$create('DIV');
      edit_option.className='badge_block multi_hide';
      edit_option.onclick=function () {        edit_task_info(this.parentNode.getAttribute('task_id'));
        track_segment_event('gantt-opened-edit-task-overlay-from-gantt-icon');
      };
      edit_option.title=_titles['gantt_task_edit'];
      insert_icon(edit_option, 'arrow-square-in');
      edit_task.appendChild(edit_option);
      //COLORS
      if (task['task_type'] == 'Task') {        var change_color=$create('DIV');
        change_color.className='badge_block edit_color';
        change_color.setAttribute('task_id', task['task_id']);
        change_color.id='task_color_' + task['task_id'];
        change_color.title=_titles['gantt_task_color'];
        change_color.onclick=function () {          display_badge_dd(
            'color',
            'task',
            this.getAttribute('task_id'),
            this,
            false
          );
          track_segment_event('gantt-opened-task-color-picker-from-gantt-icon');
        };
        var color=$create('SPAN');
        color.className='color_badge';
        change_color.appendChild(color);
        edit_task.appendChild(change_color);
      }
      //RESOURCES
      var task_resources=$create('DIV');
      task_resources.className='badge_block';
      task_resources.id='task_resources_' + task['task_id'];
      task_resources.onclick=function () {        display_badge_dd(
          'resources',
          'task',
          this.parentNode.getAttribute('task_id'),
          this,
          false
        );
        track_segment_event('gantt-opened-task-assign-from-gantt-icon');
      };
      task_resources.title=_titles['gantt_task_resources'];
      insert_icon(task_resources, 'user');
      edit_task.appendChild(task_resources);
    }
    //TIME TRACKING
    if (_projects[_projects_key[task['project_id']]]['time_tracking'] == 1) {      var time_track=$create('DIV');
      time_track.className='badge_block multi_hide';
      time_track.id='track_time_' + task['task_id'];
      time_track.setAttribute('task_id', task['task_id']);
      time_track.setAttribute('project_id', task['project_id']);
      insert_icon(time_track, 'clock');
      time_track.onclick=function () {        unhighlight_all();
        build_background_cover();
        open_tracking_task(this);
        track_segment_event('gantt-opened-task-time-tracking-from-gantt-icon');
      };
      time_track.title='Click to Track Time';
      edit_task.appendChild(time_track);
    }
    insert_quick_add_control(
      edit_task,
      task['project_id'],
      'task',
      task['task_id']
    );
    //BADGES
    if (badges.childNodes.length > 0) {      badges.appendChild(edit_task);
    }
    //TASK BAR NAMES
    if ($id('show_name_next_to_bar').checked == true) {      var name_bar=$create('DIV');
      name_bar.className='badge_task_name_bar';
      name_bar.appendChild($text(task['task_name']));
      name_bar.id='task_name_next_to_bar_' + task['task_id'];
      badges.appendChild(name_bar);
    }
    //RESOURCE NAMES
    var resources=$create('DIV');
    resources.className='task_resources';
    resources.id='task_resources_list_' + task['task_id'];
    badges.appendChild(resources);
    //ADD TO ASSIGNED RESOURCE COLUMN AS WELL
  }
  //ARROWS
  var left_arrow=$create('DIV');
  left_arrow.className='left_arrow';
  left_arrow.id='left_arrow_task_' + task['task_id'];
  left_arrow.setAttribute('task_id', task['task_id']);
  left_arrow.onclick=function () {    focus_today(_tasks[_tasks_key[this.getAttribute('task_id')]]['start_date']);
    track_segment_event('gantt-scrolled-task-into-view-from-arrow-button', {      from: 'left',
    });
  };
  var i=$create('I');
  i.className='fa fa fa-angle-left';
  left_arrow.appendChild(i);
  task_bar.appendChild(left_arrow);
  var right_arrow=$create('DIV');
  right_arrow.className='right_arrow';
  right_arrow.id='right_arrow_task_' + task['task_id'];
  right_arrow.setAttribute('task_id', task['task_id']);
  right_arrow.onclick=function () {    focus_today(_tasks[_tasks_key[this.getAttribute('task_id')]]['start_date']);
    track_segment_event('gantt-scrolled-task-into-view-from-arrow-button', {      from: 'right',
    });
  };
  var i=$create('I');
  i.className='fa fa fa-angle-right';
  right_arrow.appendChild(i);
  task_bar.appendChild(right_arrow);
  //ATTACH LISTENERS
  if (task['editable'] == 1) {    //RIGHT
    add_multi_select(task_bar_details, 'task', task['task_id']);
  }
  set_task_color('task', task['task_id'], task['color']); // set task color
  refresh_task_resources(task['task_id']); //set resources
  return [task_name, task_bar, task_meta];
}
function display_actual_hours_bar(task_id) {  task_id=task_id || '';
  if ($id('show_actual_hours_column').checked == true) {    if (task_id == '') {      var task_length=_tasks.length;
      for (var t=0; t < task_length; t++) {        display_actual_hours_bar_task(_tasks[t]['task_id']);
      }
    } else {      display_actual_hours_bar_task(task_id);
    }
  }}
function display_actual_hours_bar_task(task_id) {  var t=_tasks_key[task_id];
  var project_id=_tasks[t]['project_id'];
  //FIND TASK BAR
  if (_projects[_projects_key[project_id]]['time_tracking'] == 1) {    if ((task_bar=$id('task_div_' + _tasks[t]['task_id']))) {      var left=task_bar.getAttribute('var_left');
      var width=task_bar.getAttribute('var_width');
      var actual_hours_bar =
        $id('task_div_hours_' + _tasks[t]['task_id']) || $create('DIV');
      actual_hours_bar.id='task_div_hours_' + _tasks[t]['task_id'];
      actual_hours_bar.className='task_in_chart actual_hours_bar';
      actual_hours_bar.style.marginLeft=left + 'px';
      actual_hours_bar.setAttribute('task_id', _tasks[t]['task_id']);
      actual_hours_bar.onmousedown=function () {        $id('task_div_' + this.getAttribute('task_id')).onmousedown();
      };
      actual_hours_bar.onmouseup=function () {        $id('task_div_' + this.getAttribute('task_id')).onmouseup();
      };
      actual_hours_bar.onmousemove=function () {        $id('task_div_' + this.getAttribute('task_id')).onmousemove();
      };
      var percent =
        _tasks[t]['estimated_hours'] == 0
          ? 0
          : Math.round(
              (_tasks[t]['actual_hours'] / _tasks[t]['estimated_hours']) * 100,
              2
            ) * 0.01;
      var bar_width=width * percent;
      if (
        bar_width > width ||
        _tasks[t]['actual_hours'] > _tasks[t]['estimated_hours']
      ) {        bar_width=width;
        actual_hours_bar.className += ' red';
      } else if (bar_width <= 0) {        bar_width=0;
        actual_hours_bar.className='hidden';
      } else {        actual_hours_bar.className += ' green';
      }
      actual_hours_bar.style.width=bar_width + 'px';
      task_bar.parentNode.appendChild(actual_hours_bar);
      add_multi_select(actual_hours_bar, 'task', task_id);
    }
  }}
function add_quick_add(group_id) {  var g=_groups_key[group_id];
  var projects_key=_projects_key[_groups[g]['project_id']];
  var can_add =
    _projects[projects_key]['project_permission'] == 'admin' ||
    _projects[projects_key]['project_permission'] == 'edit';
  var is_manager_pricing=is_new_pricing(
    _projects[projects_key]['company_plan_code']
  );
  if (
    _projects[projects_key]['disabled'] == 0 &&
    (is_manager_pricing || can_add) &&
    _groups[g]['parent_group_id'] == ''
  ) {    //META
    if (_has_meta == true) {      var task_meta=$create('DIV');
      task_meta.id='task_meta_quick_add_' + _groups[g]['group_id'];
      task_meta.className='task_meta super_quick_add';
      task_meta.setAttribute('task_id', 'quick_add_' + _groups[g]['group_id']);
      task_meta.onmouseover=function () {        highlight_row('task', this.getAttribute('task_id'), 'hover_on');
      };
      task_meta.onmouseout=function () {        highlight_row('task', this.getAttribute('task_id'), 'hover_off');
      };
      //FOR DnD
      quick_add_position(task_meta, _groups[g]['group_id']);
      $id('category_meta_target_' + _groups[g]['group_id']).appendChild(
        task_meta
      );
    }
    //LEFT SIDE
    var group_target=$id('group_target_' + _groups[g]['group_id']);
    var qadd=$create('DIV');
    qadd.className='task super_quick_add';
    qadd.setAttribute('task_id', 'quick_add_' + _groups[g]['group_id']);
    qadd.id='task_title_quick_add_' + _groups[g]['group_id'];
    qadd.onmouseover=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_on');
    };
    qadd.onmouseout=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_off');
    };
    group_target.appendChild(qadd);
    var qadd_text=$create('DIV');
    qadd_text.className='super_quick_add';
    //ADD ICON
    var i=$create('I');
    i.className='fa fa-plus-circle';
    qadd_text.appendChild(i);
    //TASK
    var span=$create('SPAN');
    span.className='quick_add_task';
    span.setAttribute('group_id', _groups[g]['group_id']);
    span.onclick=quick_add_handler(_projects[projects_key], (el) => {      unhighlight_all();
      super_quick_add('task', el.getAttribute('group_id'));
      track_segment_event('gantt-added-task-from-plus-icon-menu');
    });
    span.appendChild($text('Task'));
    qadd_text.appendChild(span);
    //MILESTONE
    var span=$create('SPAN');
    span.setAttribute('group_id', _groups[g]['group_id']);
    span.onclick=quick_add_handler(_projects[projects_key], (el) => {      unhighlight_all();
      super_quick_add('milestone', el.getAttribute('group_id'));
      track_segment_event('gantt-added-milestone-from-plus-icon-menu');
    });
    span.appendChild($text('Milestone'));
    qadd_text.appendChild(span);
    //GROUP
    var span=$create('SPAN');
    span.className='group';
    span.setAttribute('group_id', _groups[g]['group_id']);
    span.onclick=quick_add_handler(_projects[projects_key], (el) => {      unhighlight_all();
      super_quick_add('group', el.getAttribute('group_id'));
      track_segment_event('gantt-added-group-from-plus-icon-menu');
    });
    span.appendChild($text('Group of Tasks'));
    qadd_text.appendChild(span);
    qadd.appendChild(qadd_text);
    qadd_text.onclick=function () {      if (_tooltip_step == 'add_task' && _tooltip_progress == 1) {        close_tooltip('add_task');
        _tooltip_progress=2;
      }
    };
    //FOR DnD
    quick_add_position(qadd, _groups[g]['group_id']);
    //INDENT
    var indent=_groups[g]['indent'];
    if (indent > 0) {      qadd_text.style.marginLeft=indent * 1 + 1 + 'em';
    }
    //RIGHT
    var group_bar_target=$id('group_bar_target_' + _groups[g]['group_id']);
    var d1=$create('DIV');
    d1.className='task super_quick_add';
    d1.setAttribute('task_id', 'quick_add_' + _groups[g]['group_id']);
    d1.id='task_quick_add_' + _groups[g]['group_id'];
    d1.onmouseover=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_on');
    };
    d1.onmouseout=function () {      highlight_row('task', this.getAttribute('task_id'), 'hover_off');
    };
    var d2=$create('DIV');
    d2.className='task_name';
    d1.appendChild(d2);
    group_bar_target.appendChild(d1);
    //FOR DnD
    quick_add_position(d1, _groups[g]['group_id']);
  }}
function insert_quick_add_control(parent, project_id, type, type_id) {  if (
    _projects[_projects_key[project_id]]['disabled'] == 0 &&
    (_projects[_projects_key[project_id]]['project_permission'] == 'admin' ||
      _projects[_projects_key[project_id]]['project_permission'] == 'edit')
  ) {    var quick_add_icon=$create('DIV');
    quick_add_icon.className='quick_add_control badge_block';
    quick_add_icon.id =
      'quick_add_' + (type === 'group' ? 'category_' : 'task_') + type_id;
    quick_add_icon.setAttribute('type', type);
    quick_add_icon.setAttribute('type_id', type_id);
    insert_icon(quick_add_icon, 'dots-three-outline-vertical');
    quick_add_icon.onclick=function () {      right_click_menu(this);
      track_segment_event('gantt-clicked-3-dot-icon-in-name-column');
    };
    quick_add_icon.oncontextmenu=function () {      right_click_menu(this);
      track_segment_event('gantt-right-clicked-on-item-in-name-column');
      return false;
    };
    quick_add_icon.onmouseover=function () {      _draw_task_allow=false;
    };
    quick_add_icon.onmouseout=function () {      setTimeout(function () {        _draw_task_allow=true;
      }, 250);
    };
    parent.appendChild(quick_add_icon);
  }}
/**
 *
 * @param {Element} parent
 * @param {string} name
 * @param {string=} icon_id
 */
function insert_icon(parent, name, icon_id) {  const svg_icons=[
    'arrow-square-in',
    'dots-three-outline-vertical',
    'trash',
    'user',
    'clock',
  ];
  if (svg_icons.includes(name)) {    return insert_svg_icon(parent, name, icon_id);
  }
  var icon=$create('I');
  icon.className='tg-icon ' + name;
  if (icon_id) {    icon.id=icon_id;
  }
  parent.appendChild(icon);
  return icon;
}
function insert_svg_icon(parent, icon_name, icon_id) {  var icon=$create('div');
  icon.className='open_details';
  icon.style.background='url(/images/'+icon_name+'-icon.svg) center center no-repeat';
  icon.style.width='100%';
  icon.style.height='100%';
  if (icon_id) {    icon.id=icon_id;
  }
  parent.appendChild(icon);
  return icon;
}
/**
 *
 * @param {string} base_class
 * @param {boolean} is_editable
 */
function generate_editable_class_name(base_class, is_editable) {  if (!is_editable) {    return base_class ? base_class : '';
  }
  return (base_class ? base_class + ' ' : '') + 'editable';
}
function is_new_pricing(plan_code) {  if (/50[\d]+(?:m|y)/i.test(plan_code)) {    return true;
  }
  return false;
}
function quick_add_handler(project, fn) {  var can_add =
    project['project_permission'] == 'admin' ||
    project['project_permission'] == 'edit';
  var company_id=project['company_id'];
  return function () {    if (!can_add) {      open_upgrade_collaborator(company_id);
      return;
    }
    fn(this);
  };
}
// JavaScript Document
////// NOTES //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function update_progress_message(target_id) {  var conf_message =
    'An email will be sent to the people assigned to this task requesting an update. The email will contain a link that they can click to update their percent complete for this task.<br /><br /> Would you like to send this email now?';
  var conf=custom_confirm(conf_message);
  conf['yes'].setAttribute('target_id', target_id);
  conf['yes'].onclick=function () {    this.ondblclick();
    save_value(
      'request_progress',
      'progress_update',
      this.getAttribute('target_id')
    );
    $id('request_progress').firstChild.nodeValue='request sent';
    $id('request_progress').style.color='#f00';
    track_segment_event('sent-request-progress');
    track_segment_event('gantt-requested-a-progress-update');
  };
  conf['no'].style.background='#fff';
  conf['no'].style.border='none';
  conf['no'].style.color='#979797';
  conf['no'].style.textDecoration='underline';
  conf['no'].firstChild.nodeValue='cancel';
  conf['yes'].firstChild.nodeValue='Yes, send request';
  var parent=conf['yes'].parentNode;
  parent.style.width=parent.offsetWidth * 1.5 + 'px';
  parent.style.marginLeft=parent.offsetWidth * -0.5 + 'px';
}
function isHTML(str) {  var a=document.createElement('div');
  a.innerHTML=str;
  for (var c=a.childNodes, i=c.length; i--; ) {    if (c[i].nodeType == 1) return true;
  }
  return false;
}
function generatePublicQueryParams(target, target_id) {  var public_query='';
  if (_projects) {    var project_id=null;
    var public_key=null;
    if (target === 'task') {      project_id=_tasks[_tasks_key[target_id]]['project_id'];
    } else if (target === 'group') {      project_id=_groups[_groups_key[target_id]]['project_id'];
    } else if (target === 'project') {      project_id=target_id;
    }
    if (_projects[_projects_key[project_id]]) {      public_key=_projects[_projects_key[project_id]]['public_key'];
    }
    if (_projects[_projects_key[project_id]]) {      public_query='&publicKeys=' + public_key + '&projectIds=' + project_id;
    }
  }
  return public_query;
}
function load_checklist(target, target_id, parent, ele, prefill_comment) {  if (isNaN(target_id)) {    return;
  }
  prefill_comment=prefill_comment || null;
  if (parent == 'note_viewer') {    var t=$id('meta_target');
  } else {    var t=$id(parent);
  }
  if (parent == 'note_viewer' && ele != null) {    open_meta_popup(target, target_id, ele);
  }
  t.className='notes_target checklist';
  open_iframe_overlay('checklist', target_id, target);
  /* REQUEST PROGRESS */
  var request_progress=$id('meta_button');
  var progress_button=$id('request_progress');
  request_progress.className='hidden';
  progress_button.onclick=null;
  $id('meta_popup').className += ' checklist';
}
function load_note(target, target_id, parent, ele, prefill_comment) {  if (isNaN(target_id)) {    return;
  }
  prefill_comment=prefill_comment || null;
  if (parent == 'note_viewer') {    var t=$id('meta_target');
  } else {    var t=$id(parent);
  }
  if (parent == 'note_viewer' && ele != null) {    open_meta_popup(target, target_id, ele);
  }
  t.className='notes_target';
  open_iframe_overlay('discussion', target_id, target);
  /* REQUEST PROGRESS */
  var request_progress=$id('meta_button');
  var progress_button=$id('request_progress');
  if (target == 'task') {    if (request_progress) {      request_progress.className='';
      progress_button.setAttribute('target_id', target_id);
      progress_button.style.color='inherit';
      progress_button.firstChild.nodeValue='Request a progress update';
      progress_button.onclick=function () {        update_progress_message(this.getAttribute('target_id'));
      };
    }
  } else {    if (request_progress) {      request_progress.className='hidden';
      progress_button.onclick=null;
    }
  }
  $id('meta_popup').className=$id('meta_popup').className.replace(
    /checklist/g,
    ''
  );
}
function get_icon_top(ele) {  var top=0;
  if ($id('gantt_location')) {    top += ele.offsetTop * 1;
    top += ele.parentNode.offsetTop * 1;
    top += $id('gantt_location').offsetTop * 1;
  }
  if ($id('list_view')) {    top += ele.parentNode.parentNode.offsetTop;
    top += $id('list_view').offsetTop * 1;
    top += ele.parentNode.parentNode.offsetHeight / 2;
    if (ele.parentNode.parentNode.id.indexOf('task') > -1) {      top -= 8;
    } else if (
      ele.parentNode.parentNode.id.indexOf('category') > -1 ||
      ele.parentNode.parentNode.id.indexOf('group') > -1
    ) {      top -= 1;
    } else if (ele.parentNode.parentNode.id.indexOf('project') > -1) {      top += 5;
    }
  }
  return top;
}
var _popup_key='';
var _popup_id='';
function open_meta_popup(target, target_id, ele, force_height=false) {  _popup_key=target;
  _popup_id=target_id;
  //MAIN DIV
  var div=$id('meta_popup');
  div.className='';
  div.setAttribute('target', target);
  div.setAttribute('target_id', target_id);
  var from_top=get_icon_top(ele);
  var from_left=ele.offsetLeft * 1 - 5;
  var y_top=get_scrolltop();
  var y_bottom=y_top * 1 + window_size('height') * 1;
  var height=Math.floor((y_bottom - y_top) * 0.75);
  var top=from_top - 30;
  var use_correction=true;
  if (_version == 'list_view') {    top += 7;
    from_left += $id('list_view').offsetLeft;
    //IF MY LIST VIEW
    if ($id('header_long_subheader')) {      from_top += $id('wrapping_div').offsetTop * 1;
      from_left += $id('wrapping_div').offsetLeft * 1;
    }
    //SPACE SIDE TAB IF IT's ALL THE WAY AT THE TOP
    if (from_top - top <= 25) {      top -= 10;
    }
  } else if (_version == 'time-tracking') {    var parent=$id(target + '_meta_comment_' + target_id).parentNode
      .parentNode;
    var real=real_position(ele);
    from_top=real.y - 15;
    from_left=real.x - 7;
    top=from_top;
  } else if (_version == 'time-sheet') {    var real=real_position(ele);
    from_top=real.y - 18;
    from_left=real.x - 10;
    top=from_top - 30;
    use_correction=false;
  }
  //DOCUMENT CORRECTION
  if (use_correction && ele.className.indexOf('document') > -1) {    from_left += 4;
  } else if (use_correction && ele.className.indexOf('time') > -1) {    from_left += 7;
  }
  if (force_height !== false) {    height=force_height;
  }
  //CORRECT BOTTOM
  var bottom=height * 1 + top;
  var overflow_y=bottom - y_bottom;
  if (overflow_y > 0) {    top=y_bottom - height - 20;
  }
  //PLACE MAIN DIV
  div.style.top=top + 'px';
  div.style.left=from_left * 1 + 30 + 'px';
  div.style.height=height + 'px';
  div.style.maxHeight=height + 'px';
  //POP OUT TAB
  var tab=$id('meta_left_tab');
  var tab_top=from_top - top + 4;
  tab.style.top=tab_top + 'px';
  tab.onclick=function () {    hide_backdrop();
    close_meta_popup();
  };
  var i=$create('I');
  i.className=ele.firstChild.className;
  remove_child_nodes(tab);
  tab.appendChild(i);
  //NOTES INTERIOR
  var notes_interior=$id('meta_target');
  interior_height=height - notes_interior.offsetTop * 2;
  notes_interior.style.height=interior_height + 'px';
  notes_interior.style.maxHeight=interior_height + 'px';
  //NAME
  var nn=$id('meta_target_name');
  remove_child_nodes(nn);
  if (target == 'task' && typeof _tasks != 'undefined') {    var task_name=_tasks[_tasks_key[target_id]]['task_name'];
    if (task_name == '') {      var task_name=$id('task_name_' + target_id).firstChild.nodeValue;
    }
    nn.appendChild($text(task_name));
  } else if (target == 'category' || target == 'group') {    nn.appendChild($text(_groups[_groups_key[target_id]]['group_name']));
  } else if (target == 'project') {    nn.appendChild($text(_projects[_projects_key[target_id]]['project_name']));
  }
  //HIGHLIGHT ROW
  if (_version == 'gantt_chart') {    setTimeout(function () {      highlight_row(target, target_id, 'hover_on');
      allow_hover=false;
    }, 10);
  }
  //BACKGROUND DIV
  var bg_cover=build_background_cover();
  bg_cover.onclick=function () {    hide_backdrop();
    close_meta_popup();
  };
  document.body.style.overflow='hidden';
  //REQUEST FEEDBACK BUTTON
  var meta_button=$id('meta_button');
  if (meta_button) {    meta_button.className='hidden';
  }}
function close_meta_popup() {  var cont=true;
  var note_click=$id(_popup_key + '_' + _popup_id + '_note');
  var note_ele=$id(_popup_key + '_' + _popup_id + '_note_edit');
  if ($id('add_comment') && $id('add_comment').value != '') {    var div=build_background_cover();
    if (div) {      div.onclick=function () {        hide_backdrop();
        close_meta_popup();
      };
    }
    var cont=custom_confirm(
      'Your comment has not yet been posted. Are you sure you want to close this window?'
    );
  } else if (
    note_click &&
    note_ele &&
    note_click.className == 'hidden' &&
    note_ele.value != ''
  ) {    var div=build_background_cover();
    if (div) {      div.onclick=function () {        hide_backdrop();
        close_meta_popup();
      };
    }
    var cont=custom_confirm(
      'Your note has not yet been updated. Are you sure you want to close this window?'
    );
  } else if (
    $id('punch_in') &&
    $id('punch_in').parentNode.id == 'time_tracking_overlay'
  ) {    return close_tracking();
  }
  //IF YES
  if (cont['yes']) {    cont['yes'].onclick=function () {      this.ondblclick();
      complete_close_meta_popup();
    };
  } else if (cont == true) {    complete_close_meta_popup();
  }}
function complete_close_meta_popup() {  _popup_key='';
  _popup_id='';
  var meta=$id('meta_popup');
  var target=meta.getAttribute('target');
  var target_id=meta.getAttribute('target_id');
  meta.setAttribute('target', null);
  meta.setAttribute('target_id', null);
  setTimeout(function () {    $id('meta_popup').className='hidden';
    document.body.style.overflowY='scroll';
    close_iframe_overlay();
  }, 100);
  setTimeout(function () {    document.body.style.overflowY='auto';
  }, 1000);
  var d=$id('background_cover');
  if (d) {    d.parentNode.removeChild(d);
  }
  allow_hover=true;
  if (_version == 'gantt_chart') {    unhighlight_all();
  }}
////// DOCUMENTS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function load_documents(target, target_id, parent, ele) {  var t='';
  if (parent == 'document_viewer') {    var t=$id('meta_target');
  } else {    t=$id(parent);
  }
  t.className='documents_target';
  var doc_iframe=$create('IFRAME');
  doc_iframe.setAttribute('frameborder', '0');
  doc_iframe.id='document_upload_iframe';
  doc_iframe.src =
    NEW_APP_URL +
    'iframe-discussion.html?targetType=' +
    target +
    '&targetId=' +
    target_id +
    '&selectedTab=documents';
  doc_iframe.onmouseover=function () {    textarea_height(this);
  };
  doc_iframe.style.height='99%';
  t.appendChild(doc_iframe);
  document.body.style.overflowY='hidden';
}
function open_document(url, do_close) {  var size=do_close == 1 ? [300, 350] : ['100%', '100%'];
  if (size[0] != '100%') {    var win=window_opener(url, size[0], size[1]);
  } else {    var win=window.open(url);
  }
  if (do_close == 1) {    if (win.opener) {      win.opener.focus();
    }
    setTimeout(function () {      win.close();
    }, 10000);
  }}
// JavaScript Document
function show_tooltip(num) {  if (num != 'NA') {    var tip_order=['edit_group_name', 'add_task', 'resize', 'resources']; //,"help_docs"];
    if (num >= tip_order.length) {      _show_tooltips=10000;
      _tooltip_progress=1000;
      _tooltip_step='done';
      update_preference({startup_tooltips: 2});
      load_gantt();
    } else {      if (tip_order[num] != undefined) {        var next=num * 1 + 1;
        next=next < tip_order.length ? next : 'NA';
        display_tooltip(tip_order[num], next, tip_order.length);
        _tooltip_step=tip_order[num];
        _tooltip_progress=1;
        _tooltip_tip_num=num;
      }
    }
  }}
var _tooltip_div=null;
function display_tooltip(which, next, total) {  if (which == 'add_task') {    var target=$id('category_task_list');
    var div=null;
    var divs=target.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      if (divs[d].id.indexOf('task_title_quick_add_') > -1 && div == null) {        div=divs[d];
        d=divs.length * 2;
      }
    }
    if (div == null) {      close_tooltip('add_task');
      setTimeout(function() {        load_next_tooltip();
      }, 100);
    } else {      document.body.className += ' no_tasks';
      _tooltip_div=div;
      div.className += ' tooltip';
      target.style.zIndex='auto';
      //FIND THE DIV's OFFSET FROM THE TOP FOR HOVER MESSAGE
      var insert_node=$create('DIV');
      insert_node.style.fontWeight='bold';
      insert_node.appendChild($text('Click to add another task'));
      //FIND HOW FAR DOWN WE NEED TO GO
      var off_top=div.offsetTop * 1; // + div.parentNode.offsetTop*1;
      off_top += div.parentNode.parentNode.offsetTop * 1; // + div.offsetHeight*1;
      off_top += div.parentNode.parentNode.parentNode.offsetTop * 1;
      //BUILD MESSAGE
      var message=tooltip_message(insert_node, which);
      message.style.top=off_top + 'px';
      message.className += ' move_center_arrow2';
      target.appendChild(message);
    }
  } else if (which == 'edit_group_name') {    var target=$id('category_task_list');
    var div=null;
    var divs=target.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      if (divs[d].id.indexOf('list_group_') > -1 && div == null) {        div=divs[d];
        d=divs.length * 2;
      }
    }
    if (div == null) {      close_tooltip('edit_group_name');
      setTimeout(function() {        load_next_tooltip();
      }, 100);
    } else {      var default_div=div;
      div=div.parentNode;
      div.className += ' tooltip';
      _tooltip_div=div;
      //FIND THE DIV's OFFSET FROM THE TOP FOR HOVER MESSAGE
      var insert_node=$create('DIV');
      var bld=$create('B');
      bld.appendChild($text('Name first Group of Tasks'));
      bld.style.fontSize='1.1em';
      insert_node.appendChild(bld);
      var footer=$create('DIV');
      //footer.style.color="#ffb4cb";
      footer.appendChild($text('e.g. Phase 1, Design, etc..'));
      insert_node.appendChild(footer);
      //FIND HOW FAR DOWN WE NEED TO GO
      var off_top=default_div.offsetTop * 1;
      off_top +=
        default_div.parentNode.parentNode.offsetTop * 1 +
        default_div.offsetHeight * 1;
      off_top += default_div.parentNode.parentNode.parentNode.offsetTop * 1;
      //BUILD MESSAGE
      var message=tooltip_message(insert_node, which);
      message.style.top=off_top + 'px';
      message.style.width='230px';
      target.appendChild(message);
      //HIGHLIGHT ROW
      var group_id1=_tooltip_div.id.split('_');
      var group_id=group_id1[group_id1.length - 1];
      highlight_row('group', group_id, 'hover_on_force');
      delay_highlight('group', group_id, 'hover_on_force');
    }
  } else if (which == 'help_docs') {    var div=$id('support_help');
    if (div) {      _tooltip_div=div;
      div.className += ' tooltip';
      div.parentNode.parentNode.style.zIndex='auto';
      //BACKGROUND COVER
      var bg=build_background_cover();
      bg.onclick=function() {        _tooltip_div.className=_tooltip_div.className.replace(/tooltip/g, '');
        this.parentNode.removeChild(this);
        close_tooltip('help_docs');
        load_next_tooltip();
      };
      //FIND THE DIV's OFFSET FROM THE TOP FOR HOVER MESSAGE
      var insert_node=$create('DIV');
      var bld=$create('B');
      bld.appendChild($text('Click Help to Learn More Tips'));
      bld.style.fontSize='0.9em';
      insert_node.appendChild(bld);
      var footer=$create('DIV');
      footer.className='tooltip_footer';
      footer.appendChild($text('e.g. Dependencies, Resources, Sub Groups...'));
      insert_node.appendChild(footer);
      //POSITIONING
      var off_top=15;
      off_top += div.offsetHeight;
      var div_width=300;
      var off_left =
        div.offsetLeft * 1 +
        div.parentNode.offsetLeft * 1 -
        div_width +
        div.offsetWidth;
      //BUILD MESSAGE
      var message=tooltip_message(insert_node, which);
      message.style.top=off_top + 'px';
      message.style.left=off_left + 'px';
      message.className += ' move_center_arrow1';
      message.style.width=div_width + 'px';
      document.body.appendChild(message);
      //document.body.style.overflow="hidden";
      //document.body.scrollTop=0;
    }
  } else if (which == 'resize') {    var target=$id('tasks');
    var insert_into=$id('utility_box');
    var div=null;
    var divs=target.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      if (
        divs[d].className.indexOf('extend extend_back') > -1 &&
        (divs[d].getAttribute('task_id') == _tooltip_force_task ||
          _tooltip_force_task == null) &&
        divs[d].parentNode.previousSibling.getAttribute('var_left') > 0
      ) {        div=divs[d];
        d=divs.length * 2;
      }
    }
    if (div == null) {      //FIND FIRST TASK BAR
      var eles=$id('tasks').getElementsByTagName('DIV');
      for (var e=0; e < eles.length; e++) {        if (
          eles[e].className.indexOf('extend extend_back') > -1 &&
          eles[e].parentNode.previousSibling.getAttribute('var_left') > 0
        ) {          div=eles[e];
          e=eles.length * 2;
        }
      }
    }
    if (div == null) {      close_tooltip('resize');
      setTimeout(function() {        load_next_tooltip();
      }, 100);
    } else {      _tooltip_div=div;
      //TEXT
      var insert_node=$create('DIV');
      var bld=$create('B');
      bld.appendChild($text('Try dragging bar ends to reschedule'));
      insert_node.appendChild(bld);
      //POSITIONING
      var task_id=div.getAttribute('task_id');
      var bar=$id('task_' + task_id);
      var off_top=findPos(bar);
      off_top += $id('gantt_location').offsetTop * -1;
      off_top += bar.offsetHeight * 1;
      var task_bar=$id('task_div_' + task_id);
      var off_left=0;
      off_left += task_bar.offsetLeft * 1;
      off_left += task_bar.offsetWidth * 1;
      var div_width=300;
      off_left += div_width / -2 - 3;
      //BUILD MESSAGE
      var message=tooltip_message(insert_node, which);
      message.style.top=off_top + 'px';
      message.style.left=off_left + 'px';
      message.style.position='absolute';
      message.style.width=div_width + 'px';
      message.className += ' move_center_arrow3';
      insert_into.appendChild(message);
      highlight_row('task', task_id, 'hover_on_force');
      delay_highlight('task', task_id, 'badges_force');
      setTimeout(function() {        $id('task_' + task_id).setAttribute('lock_off', 1);
      }, 100);
    }
  } else if (which == 'resources') {    var target=$id('tasks');
    var insert_into=$id('utility_box');
    var div=null;
    var divs=target.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      if (
        divs[d].className.indexOf('edit_resources_dd') > -1 &&
        (divs[d].parentNode.getAttribute('task_id') == _tooltip_force_task ||
          _tooltip_force_task == null)
      ) {        div=divs[d];
        d=divs.length * 2;
      }
    }
    if (div == null) {      close_tooltip('resources');
      setTimeout(function() {        load_next_tooltip();
      }, 100);
    } else {      _tooltip_div=div;
      //TEXT
      var insert_node=$create('DIV');
      var bld=$create('B');
      bld.appendChild($text('Click the person to assign this task'));
      insert_node.appendChild(bld);
      //POSITIONING
      var task_id=div.id.replace('task_resources_', '');
      var bar=$id('task_' + task_id);
      /*
var off_top=0;
off_top += bar.offsetTop*1;
off_top += bar.offsetHeight*1;
off_top += bar.parentNode.parentNode.parentNode.offsetTop*1;
*/
      var off_top=findPos(bar);
      off_top += $id('gantt_location').offsetTop * -1;
      off_top += bar.offsetHeight * 1;
      var task_bar=$id('task_div_' + task_id);
      var off_left=0;
      off_left += task_bar.offsetLeft * 1;
      off_left += task_bar.offsetWidth * 1;
      off_left += 83; //gap from bar to resource dd
      var div_width=300;
      off_left += div_width / -2 - 2;
      //SCROLL OVER IF NEEDED
      /*
var tasks=$id("tasks");
if(tasks.scrollLeft*1 + tasks.offsetWidth*1 < off_left + div_width*1)
{tasks.scrollLeft=(off_left - tasks.offsetWidth/3);
}
*/
      //BUILD MESSAGE
      var message=tooltip_message(insert_node, which);
      message.style.top=off_top + 'px';
      message.style.left=off_left + 'px';
      message.style.position='absolute';
      message.style.width=div_width + 'px';
      message.className += ' move_center_arrow3';
      insert_into.appendChild(message);
      $id('task_' + task_id).setAttribute('dont_clear', 1);
      $id('task_' + task_id).setAttribute('lock_off', 1);
      delay_highlight('task', task_id, 'hover_on_force');
      delay_highlight('task', task_id, 'badges_force');
      //unhighlight_all("task",task_id);
      setTimeout(function() {        $id('task_' + task_id).setAttribute('lock_off', 1);
        $id('task_' + task_id).setAttribute('dont_clear', 1);
      }, 100);
      //ADJUST FOR SCROLLING IF NEEDED (if it's lower down then the usable screen space)
      /*
off_top += $id("gantt_location").offsetTop*1;
var page_size=page_sizes();
var height=page_size[1];
if(off_top > height || true) {var set_top=off_top - height/2;
set_scroll_top(set_top);
}
//DISABLE OTHER ELEMENTS
var divs1=div.parentNode.parentNode.getElementsByTagName("DIV");
for(var d=0; d < divs1.length; d++)
{if(divs1[d].className.indexOf("edit_resources_dd") == -1) {divs1[d].onclick=null;
divs1[d].onmousedown=null;
divs1[d].onmouseup=null;
divs1[d].onmouseover=null;
divs1[d].onmouseout=null;
}}
*/
      //document.body.style.overflow="hidden";
      //$id("tasks").style.zIndex="auto";
    }
  }}
function findPos(obj) {  var curleft=(curtop=0);
  if (obj.offsetParent) {    do {      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while ((obj=obj.offsetParent));
  }
  //return [curleft,curtop];
  return curtop;
}
function tooltip_message(insert_node, which) {  //num=(num == "NA") ? total : num;
  var message=$create('DIV');
  message.className='tooltip_message';
  var arrow_wrapper=$create('DIV');
  arrow_wrapper.className='center_arrow_wrapper';
  var arrow=$create('DIV');
  arrow.className='center_arrow';
  arrow_wrapper.appendChild(arrow);
  message.appendChild(arrow_wrapper);
  var count=$create('DIV');
  count.className='tip_count';
  //count.appendChild($text("Quick Tip "+num+"/"+total));
  var close_it=$create('DIV');
  close_it.className='close_tip';
  close_it.appendChild($text('x'));
  close_it.setAttribute('which', which);
  close_it.onclick=function() {    close_tooltip(this.getAttribute('which'));
    load_next_tooltip();
  };
  count.appendChild(close_it);
  message.appendChild(count);
  var content=$create('DIV');
  content.className='tip_body';
  content.appendChild(insert_node);
  message.appendChild(content);
  return message;
}
function close_tooltip(which) {  if (which == 'edit_group_name') {    unhighlight_all('', '');
  } else if (which == 'help_docs') {    _tooltip_div.parentNode.className='hidden';
    setTimeout(function() {      $id('header_sublinks').className='';
    }, 100);
  } else if (which == 'resize' || which == 'resources') {    allow_hover=true;
    //unhighlight_all("","");
    if (which == 'resources' && _tooltip_div != null) {      var task_id='';
      var parts=_tooltip_div.id.split('_');
      task_id=parts[parts.length - 1];
    }
  }
  if (_tooltip_div != null) {    _tooltip_div.className=trim(
      _tooltip_div.className.replace(/tooltip/g, '')
    );
  }
  //document.body.style.overflow="auto";
  document.body.className=trim(
    document.body.className.replace(/special_hide/g, '')
  );
  $id('header').style.zIndex='';
  _tooltip_div=null;
  allow_hover=true;
  var divs=document.body.getElementsByTagName('DIV');
  for (var d=divs.length - 1; d >= 0; d--) {    if (divs[d].className.indexOf('tooltip_message') > -1) {      divs[d].parentNode.removeChild(divs[d]);
    }
  }}
function load_next_tooltip() {  show_tooltip(_tooltip_tip_num * 1 + 1);
}
function set_scroll_top(set_top) {  document.body.scrollTop=set_top;
  window.scroll(0, set_top);
  setTimeout(function() {    document.body.scrollTop=set_top;
  }, 1000);
  setTimeout(function() {    document.body.scrollTop=set_top;
  }, 2000);
}
function comment_tooltip(direction, ele) {}
// JavaScript Document
var _resource_view_height=150;
var _default_resource_view_height=150;
function display_resource_view(do_text) {  var resource_view_exists=Boolean($id('resource_view'));
  // We already have a workloads view, no need to rebuild it
  if (_version === 'gantt_chart' && _resource_view === 'open' && resource_view_exists) {    return;
  }
  do_text=do_text || '';
  if (_version == 'gantt_chart' && typeof _resource_view != 'undefined') {    if (_resource_view == 'open') {      var do_build=false;
      if (!$id('resource_view')) {        build_resource_view();
        do_build=true;
      }
      load_resource_schedule();
      if (do_build) {        setTimeout(function () {          set_resource_height();
        }, 20);
      }
    } else {      if (!$id('resource_view')) {        var d1=$create('DIV');
        resource_view_name_width(d1);
        d1.id='resource_view_list';
        d1.className='resource_collapsed';
        d1.style.marginTop='0px';
        //$id("inner_list_wrapper").appendChild(d1);
        document.body.appendChild(d1);
        var d2=$create('DIV');
        d2.id='resource_view';
        d2.className='resource_collapsed';
        d2.style.marginTop='0px';
        d2.style.fontSize=_font_size + 'px';
        //$id("task_box").appendChild(d2);
        document.body.appendChild(d2);
        //OPEN
        var d3=create_resource_view_tab_bar({isCollapsed: true});
        document.body.appendChild(d3);
      }
      _resource_view_height=null;
      workloads_positioning_based_on_footer();
    }
    //SAVE PREFERENCE
    if (do_text == 'nosave') {      //NO NEED TO SAVE THIS VALUE AS JUST A REFRESH WAS CALLED
    } else {      update_preference({resource_view_open: _resource_view});
    }
  }}
function $createFromHTML(html) {  var el=$create('DIV');
  el.innerHTML=html.trim();
  return el.firstChild;
}
function create_resource_view_tab_bar(options) {  var isCollapsed=options.isCollapsed;
  var iconName=isCollapsed ? 'triangle-up' : 'triangle-down';
  var bar=$createFromHTML(`
    <div id="resource_view_tab_bar">
      <div id="resource_view_tab_bar__tab">
        <div id="resource_view_tab_bar__tab-label">Workloads <i class="tg-icon ${iconName}"></i></div>
        <div id="resource_view_tab_bar__tab-bg">
          <svg id="resource_view_tab_bar__svg">
            <path id="resource_view_tab_bar__path" d="M5,26 c5,-19 5,-21 10,-21 l105,0 c5,0 5,2 10,21" />
          </svg>
        </div>
      </div>
      <div id="resource_view_tab_bar__resizer"><i class="tg-icon handle"></i></div>
      <div id="resource_view_tab_bar__spacer"></div>
    </div>
  `);
  var tab=bar.querySelector('#resource_view_tab_bar__tab');
  var resizer=bar.querySelector('#resource_view_tab_bar__resizer');
  if (isCollapsed) {    bar.classList.add('resource_collapsed');
    tab.onclick=function () {      do_display_resource_view('open');
      track_segment_event('gantt-opened-availability-view');
    };
  } else {    resizer.onmousedown=function () {      start_move('resource_view');
    };
    tab.onclick=function () {      do_display_resource_view('closed');
      // UPDATE CUSTOMIZED VIDEOS POSITION
      if (typeof positionCustomizedVideosPanel === 'function') {        positionCustomizedVideosPanel();
      }
    };
  }
  return bar;
}
function get_unique_workload_company_ids(projects) {  return projects.reduce(function (carry, project) {    var company_id=parseInt(project['company_id']);
    var is_workloads_enabled=project['project_in_resource_management'] === '1';
    if (!carry.includes(company_id) && is_workloads_enabled) {      carry.push(company_id);
    }
    return carry;
  }, []);
}
function get_workload_company_data(company_ids) {  var promises=company_ids.map(function (company_id) {    return new Promise(function (resolve) {      return new $ajax({        type: 'GET',
        url: API_URL + 'v1/companies/' + company_id,
        response: function (r) {          try {            return resolve(json_decode(r.responseText));
          } catch (e) {            return resolve({});
          }
        }
      });
    })
  });
  return Promise.all(promises).then(function (results) {    return results.map(function (company) {      return company;
    });
  });
}
function do_display_resource_view(do_show) {  var is_closing=do_show !== 'open';
  if (is_closing) {    execute_display_resource_view(do_show);
    return;
  }
  var company_ids=get_unique_workload_company_ids(_projects);
  var data=get_workload_company_data(company_ids);
  data.then(function (companies) {    var company_data=Array.from(companies);
    var companies_with_workloads=company_data.filter(
      function (company) {        return company.features.includes('workloads')
      }
    );
    var companies_without_workloads=company_data.filter(
      function (company) {        return !company.features.includes('workloads')
      }
    );
    // some company supports workloads, load it
    if (companies_with_workloads.length > 0) {      execute_display_resource_view(do_show);
      return;
    }
    // no companies support workloads, show modal for first company without
    if (companies_without_workloads.length > 0) {      var overlay_company=companies_without_workloads[0];
      open_go_premium('workloads', overlay_company.id);
      return;
    }
  });
}
function execute_display_resource_view(do_show) {  _resource_view=do_show;
  //REMOVE TEMPORARY BOXES
  var d1=$id('resource_view');
  if (d1) {    d1.parentNode.removeChild(d1);
  }
  var d1=$id('resource_view_list');
  if (d1) {    d1.parentNode.removeChild(d1);
  }
  var d3=$id('resource_view_tab_bar');
  if (d3) {    d3.parentNode.removeChild(d3);
  }
  ignore_scroll_timeout('ignore');
  if (do_show != 'open' && $id('resource_view_tool_tip')) {    $id('resource_view_tool_tip').parentNode.removeChild(
      $id('resource_view_tool_tip')
    );
  }
  //BUILD NEW BOXES
  display_resource_view();
  check_scroll();
  setTimeout(check_scroll, 100);
  setTimeout(match_scrolls, 100);
}
function resource_view_name_width(div) {  if (div && _version == 'gantt_chart') {    //FIND WIDTH FOR NAME COLUMN
    var width=2;
    var meta_width=0;
    var task_list_width=0;
    var details_width=0;
    var meta=$id('meta_data');
    var task_list=$id('category_task_list');
    if (meta) {      meta_width=meta.offsetWidth * 1;
      width += meta_width;
    }
    task_list_width=task_list.offsetWidth;
    width += task_list_width;
    //UPDATE STYLING
    div.style.width=width + 'px';
    //UPDATE GANTT SIDE
    width += sidebar_width();
    var resource_view=$id('resource_view');
    if (resource_view && resource_view.className != 'resource_collapsed') {      resource_view.style.left=width + 'px';
    }
    return width;
  }}
function build_resource_view() {  var list_parent=$id('tg_body');
  //BUILD NAME COLUMN
  var list=$create('DIV');
  list.id='resource_view_list';
  list.style.fontSize=_font_size + 'px';
  list_parent.appendChild(list);
  //UPDATE PLACEMENT
  var left_width=resource_view_name_width($id('resource_view_list'));
  //BAR COLUMN
  var bar_parent=$id('tg_body');
  var res_box=$create('DIV');
  res_box.id='resource_view';
  res_box.onscroll=function () {    match_scrolls();
  };
  res_box.onmouseover=function () {    _default_match='resource_view';
  };
  res_box.onmouseout=function () {    _default_match='tasks';
  };
  res_box.setAttribute('top_adjust', 0);
  res_box.style.left=left_width + 'px';
  res_box.style.fontSize=_font_size + 'px';
  bar_parent.appendChild(res_box);
  //FILTERS
  var header_wrapper=$create('DIV');
  header_wrapper.id='resource_header_wrapper';
  //DROP DOWN
  var selection=$create('DIV');
  selection.className='dropdown selected';
  selection.id='resource_view_which';
  selection.onclick=function () {    open_dd('resource_view', 'open');
  };
  header_wrapper.appendChild(selection);
  //VALUE
  var text=$create('DIV');
  text.className='text';
  selection.appendChild(text);
  var i=$create('I');
  i.className='fa fa-angle-down';
  selection.appendChild(i);
  //OPTIONS
  var selected_option=$id('resource_view_format').value;
  var selection_options=$create('DIV');
  selection_options.id='resource_view_which_options';
  selection_options.className='hidden';
  var opts=[
    ['hours', 'Hours Per Day'],
    ['total_assigned', 'Number of Tasks Per Day'],
  ];
  for (var o=0; o < opts.length; o++) {    var div=$create('DIV');
    div.className='option';
    div.setAttribute('value', opts[o][0]);
    div.setAttribute('target_input_id', 'resource_view_format');
    div.appendChild($text(opts[o][1]));
    div.onclick=function () {      manage_dropdown($id('resource_view_which'), this);
      load_resource_schedule();
      update_preference({resource_view_format: this.getAttribute('value')});
      if (this.getAttribute('value') == 'hours') {        enable_hours_popup();
      }
    };
    selection_options.appendChild(div);
    //SELECT IT IF SO
    if (selected_option == opts[o][0]) {      text.appendChild($text(opts[o][1]));
    }
  }
  //FAIL OVER IF NO PREFERENCES SET
  if (selected_option == '') {    text.appendChild($text('Number of Tasks Per Day'));
  }
  header_wrapper.appendChild(selection_options);
  //PROJECT FILTERS
  var radios=[
    ['all_active', 'All Active Projects'],
    ['this', 'Just This Project'],
  ];
  for (var r=0; r < radios.length; r++) {    var div=$create('DIV');
    div.className=r == 0 ? 'radio selected' : 'radio';
    div.setAttribute('name', 'resource_view_projects');
    div.setAttribute('target_input_id', 'resource_view_projects_value');
    div.setAttribute('value', radios[r][0]);
    div.appendChild($text(radios[r][1]));
    div.onclick=function () {      manage_radio(this);
      load_resource_schedule();
      if (
        $id(this.getAttribute('target_input_id')).value ==
          this.getAttribute('value') &&
        this.className.indexOf('selected') == -1
      ) {        this.className += ' selected';
      }
    };
    header_wrapper.appendChild(div);
  }
  res_box.appendChild(header_wrapper);
  //CLOSE
  var resource_view_tab_bar=create_resource_view_tab_bar({isCollapsed: false});
  bar_parent.appendChild(resource_view_tab_bar);
  //SCROLL
  var scroll_up=$create('DIV');
  scroll_up.id='resource_view_scroll_up';
  scroll_up.onclick=function () {    $id('resource_view').scrollTop += -35;
    set_resource_view_scroll();
    remove_selection();
  };
  scroll_up.innerHTML='<div class="tg-icon triangle-up"></div>';
  res_box.appendChild(scroll_up);
  var scroll_down=$create('DIV');
  scroll_down.id='resource_view_scroll_down';
  scroll_down.onclick=function () {    $id('resource_view').scrollTop += 35;
    set_resource_view_scroll();
    remove_selection();
  };
  scroll_down.innerHTML='<div class="tg-icon triangle-down"></div>';
  res_box.appendChild(scroll_down);
  //CONTAINERS
  var containers=[
    ['People', 'people', 'add'],
    ['Labels', 'other_resources', 'add'],
  ];
  for (var c=0; c < containers.length; c++) {    var d1=$create('DIV');
    d1.className='section_header';
    var span_link=$create('SPAN');
    span_link.onclick=function () {      $id('header_load_resources').click();
    };
    span_link.appendChild($text(containers[c][2]));
    d1.appendChild(span_link);
    d1.appendChild($text(containers[c][0]));
    list.appendChild(d1);
    var d2=$create('DIV');
    d2.className='section_header';
    res_box.appendChild(d2);
    var d3=$create('DIV');
    d3.id='resource_list_container_' + containers[c][1];
    list.appendChild(d3);
    var d2=$create('DIV');
    d2.id='resource_container_' + containers[c][1];
    res_box.appendChild(d2);
  }
  //DISPLAY RESOURCES
  var resources=_all_resources;
  for (var r=0; r < resources.length; r++) {    var res=resources[r];
    var LINK_TYPE=getNodeValue(res, 'LINK_TYPE');
    var RESOURCE_ID=getNodeValue(res, 'RESOURCE_ID');
    var RESOURCE_NAME=getNodeValue(res, 'RESOURCE_NAME');
    if (LINK_TYPE.toLowerCase() == 'user') {      var parent_left=$id('resource_list_container_people');
      var parent_right=$id('resource_container_people');
    } else {      var parent_left=$id('resource_list_container_other_resources');
      var parent_right=$id('resource_container_other_resources');
    }
    if (LINK_TYPE.toLowerCase() == 'custom' && RESOURCE_NAME == 'Unassigned') {      //do nothing
    } else {      var name=$create('DIV');
      name.className='row resource_name';
      name.appendChild($text(RESOURCE_NAME));
      name.id='resource_row_name_' + LINK_TYPE + '_' + RESOURCE_ID;
      name.setAttribute('link_type', LINK_TYPE);
      name.setAttribute('link_id', RESOURCE_ID);
      name.onmouseover=function () {        resource_highlight_row(
          this.getAttribute('link_type'),
          this.getAttribute('link_id'),
          'on'
        );
      };
      name.onmouseout=function () {        resource_highlight_row(
          this.getAttribute('link_type'),
          this.getAttribute('link_id'),
          'off'
        );
      };
      name.setAttribute(
        'href',
        'index.php?ids=MY-RESOURCE-VIEW&public_keys=LOGIN#&' +
          LINK_TYPE +
          '=' +
          RESOURCE_ID +
          '&hide_completed=true'
      );
      name.onclick=function () {        open_link(this);
        return false;
      };
      parent_left.appendChild(name);
      var bar=$create('DIV');
      bar.className='row resource_bar_parent';
      bar.setAttribute('default_class', 'row resource_bar_parent');
      bar.id='resource_row_' + LINK_TYPE + '_' + RESOURCE_ID;
      bar.setAttribute('link_type', LINK_TYPE);
      bar.setAttribute('link_id', RESOURCE_ID);
      bar.onmouseover=function () {        resource_highlight_row(
          this.getAttribute('link_type'),
          this.getAttribute('link_id'),
          'on'
        );
      };
      bar.onmouseout=function () {        resource_highlight_row(
          this.getAttribute('link_type'),
          this.getAttribute('link_id'),
          'off'
        );
      };
      parent_right.appendChild(bar);
      name.title='Click to see all tasks for this user/label';
    }
  }
  //UNASSIGNED RESOURCE
  var name=$create('DIV');
  name.className='row resource_name';
  name.appendChild($text('Unassigned'));
  name.id='resource_row_name_unassigned_0';
  name.onmouseover=function () {    resource_highlight_row('unassigned', 0, 'on');
  };
  name.onmouseout=function () {    resource_highlight_row('unassigned', 0, 'off');
  };
  list.appendChild(name);
  var bar=$create('DIV');
  bar.className='row resource_bar_parent';
  bar.id='resource_row_unassigned_0';
  bar.setAttribute('default_class', 'row resource_bar_parent');
  bar.onmouseover=function () {    resource_highlight_row('unassigned', 0, 'on');
  };
  bar.onmouseout=function () {    resource_highlight_row('unassigned', 0, 'off');
  };
  $id('resource_container_other_resources').appendChild(bar);
  //BACKGROUND MOVER
  var div=$create('DIV');
  div.id='resources_move_bg';
  div.className='hidden';
  res_box.appendChild(div);
  var bottom_space=$create('DIV');
  bottom_space.style.height='22px';
  res_box.appendChild(bottom_space);
  var bottom_space=$create('DIV');
  bottom_space.style.height='22px';
  list.appendChild(bottom_space);
  if (_resource_view_height != null) {    list.style.height=_resource_view_height + 'px';
    list.style.maxHeight=_resource_view_height + 'px';
    res_box.style.height=_resource_view_height + 'px';
    res_box.style.maxHeight=_resource_view_height + 'px';
    check_scroll();
  }
  if (_hide_resource_view_tool_tip == '') {    var tip=$create('DIV');
    tip.id='resource_view_tool_tip';
    tip.appendChild($text('Want to know how busy your team is? '));
    var alink=$create('A');
    alink.setAttribute(
      'href',
      '//fast.wistia.net/embed/iframe/lmacshw8nt?popover=true'
    );
    alink.setAttribute('target', '_blank');
    alink.onclick=function () {      window_opener(this.getAttribute('href'), '90%', '90%');
      return false;
    };
    alink.appendChild($text('Watch this quick video to learn how.'));
    tip.appendChild(alink);
    var close_tip=$create('DIV');
    close_tip.id='resource_view_tool_tip_close';
    close_tip.onclick=function () {      update_preference({hide_resource_view_tool_tip: 'hide'});
      this.parentNode.parentNode.removeChild(this.parentNode);
      // UPDATE CUSTOMIZED VIDEOS POSITION
      if (typeof positionCustomizedVideosPanel === 'function') {        positionCustomizedVideosPanel();
      }
    };
    close_tip.appendChild($text('(x) close tip'));
    tip.appendChild(close_tip);
    document.body.appendChild(tip);
  }}
function open_link(ele) {  var middle_date=find_middle_date();
  var urlstring =
    'index.php?ids=MY-RESOURCE-VIEW&public_keys=LOGIN&onload=focus_date,' +
    middle_date +
    '#&' +
    ele.getAttribute('link_type') +
    '=' +
    ele.getAttribute('link_id') +
    '&hide_completed=true';
  ele.setAttribute('href', urlstring);
  //open_inner_popup(ele);
  window_opener(urlstring, '90%', '90%');
  track_segment_event('gantt-clicked-task-in-availability-view');
}
var _allow_resource_view_refresh=true;
var _resource_view_denied_pings=0;
function load_resource_schedule(start_date, end_date) {  if (!_allow_resource_view_refresh) {    return;
  }
  // prevent re-fetching workloads while we're already fetching them
  _allow_resource_view_refresh=false;
  var user=[];
  var company=[];
  var project=[];
  var ar_len=_all_resources.length;
  for (var i=0; i < ar_len; i++) {    var resource_info=_all_resources[i];
    var LINK_TYPE=getNodeValue(resource_info, 'LINK_TYPE');
    var PROJECT_ID=getNodeValue(resource_info, 'PROJECT_ID');
    var RESOURCE_ID=getNodeValue(resource_info, 'RESOURCE_ID');
    var RESOURCE_NAME=getNodeValue(resource_info, 'RESOURCE_NAME');
    if (RESOURCE_ID != 'unassigned') {      if (LINK_TYPE == 'user') {        user.push(RESOURCE_ID);
      } else if (LINK_TYPE == 'company') {        company.push(RESOURCE_ID);
      } else if (LINK_TYPE == 'custom') {        project.push(RESOURCE_ID);
      }
    }
  }
  if (start_date === undefined || end_date === undefined) {    var range=get_workload_date_range();
    start_date=range.start_date;
    end_date=range.end_date;
  }
  get_workloads(user, company, project, start_date, end_date);
}
function get_workload_date_range() {  var dates=document.getElementsByClassName('day_lines');
  return {    start_date: dates[0].getAttribute('date'),
    end_date: dates[dates.length - 1].getAttribute('date'),
  }}
function generate_workload_chunks(type, ids, start_date, end_date) {  var chunk_size=5;
  var chunks=[];
  var start_year=parseInt(start_date.split('-')[0]);
  var end_year=parseInt(end_date.split('-')[0]);
  var start_year_date=new Date(start_date);
  var start_year_january=new Date(start_year + '-01-01');
  var end_year_date=new Date(end_date);
  var end_year_december=new Date(end_year + '-12-31');
  for (var i=0; i < ids.length; i += chunk_size) {    for (var year=start_year; year <= end_year; year++) {      var use_start_date=year === start_year ? start_date : year + '-01-01';
      var use_end_date=year === end_year ? end_date : year + '-12-31';
      chunks.push({        target: type,
        ids: ids.slice(i, i + chunk_size),
        start_date: use_start_date,
        end_date: use_end_date,
      });
    }
  }
  return chunks;
}
function generate_workload_batches(
  users,
  company,
  project,
  start_date,
  end_date
) {  var batches=[].concat(
    generate_workload_chunks('users', users, start_date, end_date),
    generate_workload_chunks(
      'company_resources',
      company,
      start_date,
      end_date
    ),
    generate_workload_chunks('project_resources', project, start_date, end_date)
  );
  batches.push({target: 'unassigned', ids: []});
  return batches;
}
function get_workloads(users, company, project, initial_start_date, initial_end_date) {  var start_date=initial_start_date || null;
  var end_date=initial_end_date || null;
  var batches_fetched=0;
  var responses=[];
  //TITLE TEXT
  var title_text=$create('DIV');
  title_text.id='resource_view_title_text';
  title_text.className='hidden';
  $id('resource_view').appendChild(title_text);
  var project_filter=$id('resource_view_projects_value').value;
  var project_ids=$id('project_ids').value.split(',');
  var batches=generate_workload_batches(
    users,
    company,
    project,
    start_date,
    end_date
  );
  batches.map(function (batch) {    var url=API_URL + 'v1/workload/' + batch.target;
    var params={};
    if (batch.target !== 'unassigned') {      params['start_date']=batch.start_date;
      params['end_date']=batch.end_date;
    }
    if (batch.ids && batch.ids.length !== 0) {      params['ids']=batch.ids.join('&ids=');
    }
    if (batch.target === 'unassigned' || project_filter === 'this') {      params['project_ids']=project_ids.join('&project_ids[]=');
    }
    var queryString=Object.keys(params)
      .map(function (key) {        return key + '=' + params[key];
      })
      .join('&');
    url += '?' + queryString;
    new $ajax({      type: 'GET',
      url: url,
      response: function (data) {        batches_fetched++;
        var json=JSON.parse(data.response);
        if (batch.target === 'unassigned') {          // the unassigned response has a different shape
          responses.push(json);
        } else {          json.map(function (resource) {            responses.push(resource);
          });
        }
        if (batches_fetched === batches.length) {          rerender_workload_cells(users, company, project, responses, start_date, end_date);
        }
      },
    });
    return;
  });
}
function rerender_workload_cells(users, company, project, responses, start_date, end_date) {  _allow_resource_view_refresh=true;
  reset_workload_rows(users, company, project, start_date, end_date);
  responses.map(function (resource) {    display_workload_for_resource(resource);
  });
}
function reset_workload_rows(users, company_resources, project_resources, start_date, end_date) {  users.map(function (user) {    reset_workload_row('user', user, start_date, end_date);
  });
  company_resources.map(function (company) {    reset_workload_row('company', company, start_date, end_date);
  });
  project_resources.map(function (project) {    reset_workload_row('custom', project, start_date, end_date);
  });
  reset_workload_row('unassigned', 0, start_date, end_date);
}
function reset_workload_row(type, type_id, start_date, end_date) {  var parent=$id('resource_row_' + type + '_' + type_id);
  if (!parent) {    return;
  }
  if (start_date === undefined || end_date === undefined) {    remove_child_nodes(parent);
  }
  var children=Array.from(parent.childNodes);
  var start_date_ms=Date.parse(start_date);
  var end_date_ms=Date.parse(end_date);
  for (var i=children.length - 1; i >= 0; i--) {    var element=children[i];
    var element_date_ms=Date.parse(element.getAttribute('date'));
    if (element_date_ms >= start_date_ms && element_date_ms <= end_date_ms) {      parent.removeChild(element);
    }
  }}
function display_workload_for_resource(resource) {  var data=resource.data;
  var type=resource.type.replace('_resource', '');
  var type_id=resource.type_id;
  if (type === 'project') {    type='custom';
  } else if (type == 'unassigned') {    type_id=0;
  }
  var parent=$id('resource_row_' + type + '_' + type_id);
  if (!parent) {    return;
  }
  var zoom=$id('zoom').value;
  var font_size=$id('font_size').value;
  var day_width=find_day_width();
  var hide_completed=$id('hide_completed').checked;
  var row_height=$id('resource_row_name_unassigned_0').offsetHeight;
  var view=$id('resource_view_format').value;
  parent.className='row resource_bar_parent ' + zoom + ' font' + font_size;
  data.map(function (row) {    var target_date=row.date;
    var date_parts=target_date.split('-');
    if (view === 'hours') {      var date_load=!hide_completed ? row.hours_total : row.hours_remaining;
      date_load=Math.round(date_load * 10) / 10;
    } else {      var date_load=!hide_completed ? row.tasks_total : row.tasks_remaining;
    }
    if (date_load == 0) {      return;
    }
    var pos=find_position(target_date, target_date, day_width);
    var left=pos[0];
    var width=pos[1];
    var is_hidden=pos[2];
    var is_holiday =
      js_in_array(
        date_parts[0] + '-' + date_parts[1] * 1 + '-' + date_parts[2] * 1,
        _holidays
      ) > -1 ||
      js_in_array(
        '*-' + date_parts[1] * 1 + '-' + date_parts[2] * 1,
        _holidays
      ) > -1;
    if (is_holiday) {      return;
    }
    var date_day=new Date(target_date).getUTCDay();
    var is_chart_day=_chart_days.includes(date_day);
    if (!is_chart_day) {      return;
    }
    var div=$create('DIV');
    div.style.position='absolute';
    div.style.top=0;
    div.style.left=left + 'px';
    div.style.width=width * 1 + 1 + 'px';
    div.style.height=row_height - 1 + 'px';
    div.style.lineHeight=row_height - 1 + 'px';
    div.className='bar';
    div.setAttribute('resource_type', type);
    div.setAttribute('date', target_date);
    div.appendChild($text(date_load));
    var title_message='';
    if (view == 'total_assigned') {      var load_num=Math.min(date_load, 10);
      div.className += ' load' + load_num;
      title_message=date_load + ' task(s) assigned to ';
    }
    if (view == 'hours') {      var work_day=8;
      var work_load=date_load;
      var color='';
      var top=0;
      if (work_load < work_day) {        color='blue';
        top=1 - work_load / work_day;
        top=top * row_height;
      } else if (work_load == work_day) {        color='light_red';
        top=0;
      } else if (work_load > work_day) {        color='dark_red';
        top=0;
      }
      div.className += ' ' + color;
      div.style.backgroundPosition='0 ' + top + 'px';
      title_message=date_load + ' hours(s) assigned to ';
      if ($id('resource_row_name_' + type + '_' + type_id)) {        title_message +=
          $id('resource_row_name_' + type + '_' + type_id).textContent + ' on ';
      }
    }
    if (title_message != '') {      div.setAttribute('title_message', title_message);
      div.onmouseover=function () {        this.setAttribute('mouseover', 1);
        check_hover_resource_view(this, 500);
      };
      div.onmouseout=function () {        this.setAttribute('mouseover', 0);
        $id('resource_view_title_text').className='hidden';
      };
      div.onclick=function () {        resource_load_details(this, type, type_id, target_date);
        track_segment_event('gantt-click-date-cell-in-availability-view');
      };
    }
    const task_count=!hide_completed ? row.tasks_total : row.tasks_remaining;
    div.setAttribute('task_count', task_count);
    parent.appendChild(div);
  });
}
function check_hover_resource_view(ele, delay) {  if (delay == null) {    if (ele.getAttribute('mouseover') == 1) {      var message =
        ele.getAttribute('title_message') +
        ' ' +
        day_of_the_week(ele.getAttribute('date')) +
        ', ' +
        pretty_date(ele.getAttribute('date'), 'no') +
        '.';
      message += ' Click cell to see details.';
      var parent=$id('resource_view_title_text');
      remove_child_nodes(parent);
      parent.appendChild($text(message));
      parent.style.top =
        ele.parentNode.offsetTop * 1 + ele.offsetHeight * 1 + 5 + 'px';
      parent.style.left=ele.offsetLeft + 'px';
      parent.style.marginLeft=0;
      parent.className='';
      //OVERFLOW FIX
      var max_right =
        $id('tasks').scrollLeft * 1 + $id('tasks').offsetWidth * 1;
      var diff =
        max_right - (parent.offsetLeft * 1 + parent.offsetWidth * 1 + 10);
      if (diff < 0) {        parent.style.marginLeft=diff + 'px';
      }
      var bottom =
        parent.parentNode.scrollTop * 1 + parent.parentNode.offsetHeight * 1;
      var diff=bottom - (parent.offsetTop * 1 + parent.offsetHeight * 1);
      if (diff < 0) {        parent.style.top =
          ele.parentNode.offsetTop * 1 - parent.offsetHeight * 1 + 'px';
      }
    }
  } else {    setTimeout(function () {      check_hover_resource_view(ele, null);
    }, delay);
  }}
function resource_load_details(ele, resource, resource_id, day) {  var date_parts=day.split('-');
  var date=new Date(Date.parse(day));
  var day_of_week=date.getUTCDay();
  var project_filter=$id('resource_view_projects_value').value;
  var hide_completed=$id('hide_completed').checked;
  if (resource === 'user') {    var resource_key='user_resource_ids';
  } else if (resource === 'company') {    var resource_key='company_resource_ids';
  } else if (resource === 'custom') {    var resource_key='project_resource_ids';
  }
  var url =
    API_URL +
    'v1/tasks?' +
    'start_date=' +
    day +
    '&end_date=' +
    day +
    '&is_included_in_workloads=true' +
    '&project_chart_day=' +
    day_of_week;
  if (resource === 'unassigned') {    url += '&unassigned=true';
  } else {    url += '&' + resource_key + '[]=' + resource_id;
  }
  if (project_filter === 'this' || resource === 'unassigned') {    url +=
      '&project_ids[]=' +
      $id('project_ids').value.split(',').join('&project_ids[]=');
  }
  if (hide_completed) {    url += '&hide_completed=true';
  }
  $ajax({    type: 'GET',
    url: url,
    response: function (data) {      var tasks=JSON.parse(data.response);
      var projects=$id('project_ids').value.split(',');
      var view=$id('resource_view_format').value;
      var is_hours_view=view === 'hours';
      var bg=build_background_cover();
      bg.id='resource_view_background';
      bg.style.background='none';
      bg.onclick=function () {        hide_backdrop();
        remove_child_nodes($id('resource_view_day_details'));
        parent.className='hidden';
      };
      //FLAG ELE WITH AN ID
      ele.id =
        ele.getAttribute('resource_type') +
        '_' +
        resource_id +
        '_' +
        ele.getAttribute('date');
      //BUILD WRAPPER
      var parent=$id('resource_view_day_details');
      remove_child_nodes(parent);
      parent.className='';
      parent.setAttribute('ele', ele.id);
      var inner=$create('DIV');
      inner.className='inner';
      parent.appendChild(inner);
      //IN THIS PROJECT
      var in_projects=$create('DIV');
      in_projects.className='resource_view_heading';
      in_projects.style.marginTop='1em';
      in_projects.appendChild($text('Tasks in This Gantt Chart'));
      inner.appendChild(in_projects);
      var in_projects_content=$create('DIV');
      in_projects_content.id='resource_view_in_projects';
      inner.appendChild(in_projects_content);
      //NOT IN THIS PROJECT
      var not_in_projects=$create('DIV');
      not_in_projects.className='resource_view_heading';
      not_in_projects.style.marginTop='1em';
      not_in_projects.appendChild($text('Tasks in Other Active Projects'));
      inner.appendChild(not_in_projects);
      var not_in_projects_content=$create('DIV');
      not_in_projects_content.id='resource_view_not_in_projects';
      inner.appendChild(not_in_projects_content);
      for (var t=0; t < tasks.length; t++) {        var task=tasks[t];
        var project_id=task.project_id;
        var task_id=task.id;
        var project_name=task.project_name;
        var group_name=task.parent_group_name;
        var task_name=task.name;
        var work_load=get_workload_assigned_duration(
          task,
          is_hours_view,
          resource,
          resource_id
        );
        var div=$create('DIV');
        div.className='resource_view_task';
        div.setAttribute('task_id', task_id);
        if (task_id != '') {          var details=$create('DIV');
          details.className='resource_view_task_details';
          details.appendChild($text(project_name + ' : ' + group_name));
          div.appendChild(details);
        }
        var task=$create('DIV');
        task.className='task_name';
        div.appendChild(task);
        var task_load=$create('DIV');
        task_load.className='task_load';
        task_load.appendChild($text(work_load));
        task.appendChild(task_load);
        task.appendChild($text(task_name));
        if (js_in_array(project_id, projects) > -1) {          div.onclick=function () {            resource_details_focus_target('task', this.getAttribute('task_id'));
            if ($id('resource_view_background')) {              $id('resource_view_background').click();
            }
            track_segment_event('gantt-clicked-task-in-availability-view');
          };
          in_projects_content.appendChild(div);
        } else {          if (task_id != '') {            div.setAttribute('project_id', project_id);
            div.onclick=function () {              window_opener(
                '../schedule/?ids=' +
                  this.getAttribute('project_id') +
                  '&onload=highlight-task,' +
                  this.getAttribute('task_id'),
                '90%',
                '90%'
              );
            };
          }
          not_in_projects_content.appendChild(div);
        }
      }
      const assigned_task_count=parseInt(ele.getAttribute('task_count'));
      const visible_task_count=tasks.length;
      const assigned_vs_visible=assigned_task_count - visible_task_count;
      //PRIVATE TASK
      if (assigned_vs_visible > 0) {        const task_vs_tasks=assigned_vs_visible === 1 ? 'task' : 'tasks';
        var private_task=$create('DIV');
        private_task.className='resource_view_task_private';
        private_task.appendChild($text([
          '+',
          assigned_vs_visible,
          'private',
          task_vs_tasks
        ].join(' ')));
        not_in_projects_content.appendChild(private_task);
      }
      //HIDE SECTIONS IF NEEDED
      if (in_projects_content.childNodes.length == 0) {        in_projects.className='hidden';
      }
      if (not_in_projects_content.childNodes.length == 0) {        not_in_projects.className='hidden';
      }
      var pointer=$create('DIV');
      pointer.id='resource_details_pointer';
      parent.appendChild(pointer);
      place_resource_details(parent, ele);
    },
  });
}
function get_workload_assigned_duration(
  task,
  is_hours_view,
  resource_type,
  resource_id
) {  if (!is_hours_view) {    return '';
  }
  var hours=task.resources.reduce(function (carry, resource) {    if (resource.type !== resource_type || resource.type_id != resource_id) {      return carry;
    }
    carry += resource.hours_per_day;
    return carry;
  }, 0);
  if (hours === 0) {    return '';
  }
  return '(' + hours + ' hrs)';
}
function resource_details_focus_target(target, id) {  allow_hover=true;
  unhighlight_all();
  highlight_row(target, id, 'hover_on');
  highlight_row(target, id, 'moving');
  var ele=$id((target === 'group' ? 'category' : 'task') + '_title_' + id);
  var pos=real_position(ele);
  var scroll_y=pos.y - 225;
  document.body.scrollTop=scroll_y;
  window.scroll(0, scroll_y);
}
function place_resource_details(parent, ele) {  if (_version == 'gantt_chart') {    //MAX HEIGHT
    var max_height=500;
    parent.firstChild.style.maxHeight=max_height + 'px';
    //POSITION IT
    var left=ele.offsetLeft - $id('tasks').scrollLeft + ele.offsetWidth * 0.5;
    left += $id('meta_data') ? $id('meta_data').offsetWidth * 1 : 0;
    left += $id('category_task_list').offsetWidth * 1;
    left -= parent.offsetWidth * 0.5;
    parent.style.left=left + 'px';
    var max_edge=$id('tasks').offsetWidth * 1 + $id('tasks').offsetLeft - 5;
    var overlap=left * 1 + parent.offsetWidth - max_edge;
    if (overlap > 0) {      left -= overlap;
      parent.style.left=left + 'px';
      var pointer=$id('resource_details_pointer');
      pointer.style.marginLeft=overlap + 'px';
    }
    var top=$id('resource_view').offsetTop * 1;
    top += ele.parentNode.offsetTop * 1;
    top -= $id('resource_view').scrollTop * 1;
    top += get_scrolltop();
    top -= 12;
    var ele_top=top;
    top -= parent.offsetHeight;
    parent.style.top=top + 'px';
    var scrolltop=document.body.scrollTop * 1;
    if (top < scrolltop + 10) {      var diff=top - scrolltop - 10;
      top -= diff;
      max_height=ele_top - 25 - scrolltop;
      parent.firstChild.style.maxHeight=max_height - 12 + 'px';
    }
    parent.style.top=top + 'px';
  }}
function resource_highlight_row(what, id, direction) {  var div1=$id('resource_row_' + what + '_' + id);
  var div2=$id('resource_row_name_' + what + '_' + id);
  if (div1 && div2) {    if (direction == 'on') {      div1.className += ' highlight';
      div2.className += ' highlight';
    } else if (direction == 'off') {      div1.className=trim(div1.className.replace(/highlight/g, ''));
      div2.className=trim(div2.className.replace(/highlight/g, ''));
    }
  }}
var _raci=[];
/**
 * Loads RACI data for the specified projects
 *
 * @param {number[]} project_ids
 */
function load_raci(project_ids) {  // reset raci because we're fetching new values
  _raci=[];
  project_ids.forEach(project_id => {    load_project_raci(project_id);
  });
}
/**
 * Loads RACI data for the specified project
 *
 * @param {number} project_id
 */
function load_project_raci(project_id) {  $ajax({    parent: this,
    type: 'GET',
    url: API_URL + 'v1/projects/' + project_id + "/raci_roles",
    response: function(response) {      if (response.status !== 200) {        return;
      }
      var json=json_decode(response.responseText);
      _raci=_raci.concat(json);
      window.show_raci();
    },
  });
}
/**
 * Renders the RACI role after the assigned resource. With Gantt View being limited to just assignments,
 * only users assigned to the task will have a RACI designation. Others will be ignored.
 */
function show_raci() {  _raci.forEach(raci => {    if (raci.target_type !== "task") {      return;
    }
    if (raci.resource_type !== "user") {      return;
    }
    if (_tasks_key[raci.target_id] === undefined) {      return;
    }
    refresh_task_resources(raci.target_id);
  });
}
/**
 * For the specified information return the necessary RACI role, or null if no role is found.
 *
 * @param {string} target_type
 * @param {number} target_id
 * @param {string} resource_type
 * @param {number} resource_id
 *
 * @returns null|string
 */
function get_raci_role_for_target(target_type, target_id, resource_type, resource_id) {  var roles=_raci.filter(raci => {    return raci.resource_id == resource_id && raci.resource_type == resource_type && raci.target_id == target_id && raci.target_type == target_type;
  });
  if (roles.length === 0 || roles[0].roles.length === 0) {    return null;
  }
  return ['(', roles[0].roles.join(', '), ')'].join('');
}
var AUTOSAVE_PREFERENCE_KEY='app.web.closedAutoSaveNotification';
tgEvents.subscribeAll(
  [tgEvents.CURRENT_USER_LOADED, tgEvents.GANTT_LOADED],
  function (details) {    var currentUser=details[0];
    if (!currentUser) {      return;
    }
    toggleAutosaveBanner(currentUser);
  }
);
function toggleAutosaveBanner(currentUser) {  var closedAutoSaveNotification=currentUser.preferences_new.find(function (
    preference
  ) {    return preference.key === AUTOSAVE_PREFERENCE_KEY;
  });
  if (closedAutoSaveNotification && closedAutoSaveNotification.value) {    return;
  }
  var banner=$id('autosave_banner');
  if (!banner) {    return;
  }
  banner.classList.remove('hidden');
}
function closeAutosaveBanner() {  var banner=$id('autosave_banner');
  if (!banner) {    return;
  }
  banner.classList.add('hidden');
  update_preference_new({    key: AUTOSAVE_PREFERENCE_KEY,
    type: 'boolean',
    value: true,
  });
}
var _iframe_overlays_loaded={};
var _iframe_options={  global_time_tracker: {    on_close: function () {      gtt.fetch_current();
    },
    inline: true,
  },
};
function should_use_iframe(name='') {  var is_edit_iframe=name.includes('edit');
  var is_embed_view=get_is_embedded_view();
  return !is_edit_iframe || !is_embed_view;
}
function get_iframe_options(name) {  return _iframe_options[name] || {};
}
function preload_iframe_elements() {  const url=new URL(window.location.href);
  const is_share_view=url.searchParams.get('share') !== null;
  var public_keys=get_public_keys();
  var _is_public_view=public_keys.length > 0 || is_share_view;
  if (!_is_public_view) {    ensure_iframe_element_loaded('discussion');
  }
  if (!_is_public_view && should_use_iframe('edit_task')) {    ensure_iframe_element_loaded('edit_task');
  }}
function open_overlay_from_hash() {  // preload is added here to ensure gantt is ready to roll
  preload_iframe_elements();
  if (!HashSearch.keyExists('edit')) {    return;
  }
  var parts=HashSearch.get('edit').split('_');
  var edit_target=parts[0];
  var edit_target_id=parseInt(parts[1]);
  if (
    !['project', 'group', 'task'].includes(edit_target) ||
    isNaN(edit_target_id)
  ) {    return;
  }
  open_iframe_overlay('edit_' + edit_target, edit_target_id, edit_target);
}
function iframe_overlay_loaded(name) {  _iframe_overlays_loaded[name]=true;
}
function is_iframe_overlay_ready(name) {  return _iframe_overlays_loaded[name] === true;
}
function get_iframe_element(name) {  return $id(get_iframe_element_id(name));
}
function get_iframe_element_id(name) {  return name + '_iframe_overlay';
}
function get_payload_message(type, payload) {  var newPayload=payload || {};
  newPayload.type=newPayload.type || type;
  return JSON.stringify(newPayload);
}
function iframe_post_message(iframe, type, payload) {  iframe.contentWindow.postMessage(
    get_payload_message(type, payload),
    NEW_APP_URL
  );
}
function parent_post_message(type, payload) {  window.parent.postMessage(get_payload_message(type, payload), NEW_APP_URL);
}
function iframe_overlay_ready(name) {  // iframe overlays need to have an id of `name_iframe_overlay`, ie `checklist_iframe_overlay`.
  hide_iframe_overlay();
  var iframe=get_iframe_element(name);
  iframe.classList.remove('hidden');
  if (!get_iframe_options(name).inline) {    document.body.style.overflowY='hidden';
  }}
function get_opened_iframe_overlay() {  var iframeNames=Object.keys(_iframe_overlays_loaded);
  for (var i=0; i < iframeNames.length; i++) {    var iframe=get_iframe_element(iframeNames[i]);
    if (!iframe.classList.contains('hidden')) {      return iframe;
      break;
    }
  }
  return null;
}
function open_go_premium(key, company_id) {  if (get_is_embedded_view()) {    if (key === 'workloads' || key === 'baselines') {      parent_post_message('go-premium', {companyId: company_id, feature: key});
      return;
    }
  }
  var src=NEW_APP_URL + 'iframe-go-premium.html';
  if (key) {    src += '?target=' + key;
    if (company_id) {      src += '&company_id=' + company_id;
    }
  }
  if (!is_iframe_overlay_ready('go_premium')) {    var iframe=$create('iframe');
    iframe.src=src;
    iframe.id='go_premium_iframe_overlay';
    iframe.className='hidden';
    document.body.appendChild(iframe);
  } else {    var iframe=$id('go_premium_iframe_overlay');
    if (iframe.src !== src) {      iframe.src=src;
    }
  }
  open_iframe_overlay('go_premium', 1234, 'go_premium-target');
}
/**
 * Opens an upgrade modal in web-client, see old-app-gantt there}
 *
 * @param {String|undefined} company_id
 */
function open_upgrade_collaborator(company_id) {  if (get_is_embedded_view()) {    parent_post_message('collaborator-upgrade-modal', {companyId: company_id});
    return;
  }
  var src=NEW_APP_URL + 'iframe-collaborator-upgrade.html';
  if (company_id) {    src += '?company_id=' + company_id;
  }
  if (!is_iframe_overlay_ready('collaborator_upgrade')) {    var iframe=$create('iframe');
    iframe.src=src;
    iframe.id='collaborator_upgrade_iframe_overlay';
    iframe.className='hidden';
    document.body.appendChild(iframe);
  } else {    var iframe=$id('collaborator_upgrade_iframe_overlay');
    if (iframe.src !== src) {      iframe.src=src;
    }
  }
  open_iframe_overlay(
    'collaborator_upgrade',
    1234,
    'collaborator_upgrade-target'
  );
}
function is_iframe_overlay_open() {  var iframe=get_opened_iframe_overlay();
  if (iframe) {    return true;
  }
  return false;
}
function is_iframe_overlay_loaded(name) {  var iframe=get_iframe_element(name);
  if (iframe) {    return true;
  }
  return false;
}
function close_iframe_overlay() {  hide_iframe_overlay();
  HashSearch.remove('edit');
  load_gantt();
}
function hide_iframe_overlay() {  var iframe=get_opened_iframe_overlay();
  if (iframe) {    const name=iframe.getAttribute('name');
    iframe.classList.add('hidden');
    iframe_post_message(iframe, 'iframe-overlay-closed');
    if (get_iframe_options(name).on_close) {      get_iframe_options(name).on_close();
    }
  }}
function open_iframe_overlay(name, id, target, loading) {  var message_type='iframe-overlay-opened';
  if (isNaN(id)) {    return;
  }
  var payload={    name: name,
    targetId: id,
    targetType: target,
  };
  if (!should_use_iframe(name)) {    parent_post_message(message_type, payload);
    return;
  }
  ensure_iframe_element_loaded(name);
  if (!is_iframe_overlay_ready(name)) {    start_load('gantt');
    setTimeout(function () {      open_iframe_overlay(name, id, target, true);
    }, 200);
  } else {    var iframe=get_iframe_element(name);
    iframe_post_message(iframe, message_type, payload);
    if (loading) {      finish_load();
    }
  }}
function ensure_iframe_element_loaded(name) {  if (is_iframe_overlay_loaded(name)) {    return;
  }
  const iframe=make_iframe_element(name);
  if (name.indexOf('edit') > -1 || name === 'global_time_tracker') {    iframe.classList.add('edit_target_overlay_iframe');
    document.body.appendChild(iframe);
  } else {    iframe.classList.add('iframe_overlay');
    var public_keys=get_public_keys();
    var project_ids=$id('project_ids').value;
    if (public_keys.length) {      iframe.src += '?publicKeys=' + public_keys + '&projectIds=' + project_ids;
    }
    $id('meta_target').appendChild(iframe);
  }}
function make_iframe_element(name) {  var iframe=$create('iframe');
  iframe.id=get_iframe_element_id(name);
  iframe.setAttribute('name', name);
  iframe.className='hidden';
  iframe.src=NEW_APP_URL + 'iframe-' + name.replaceAll('_', '-') + '.html';
  return iframe;
}
window.addEventListener('load', function () {  if (typeof tgEvents === 'undefined') {    return;
  }
  if (!get_is_embedded_view()) {    return;
  }
  tgEvents.subscribe(tgEvents.HASH_CHANGED, function (data) {    parent_post_message('hash-changed', {      search: get_new_app_query(),
    });
  });
});
function createTooltipContainer() {  var tooltipContainer=$create('DIV');
  tooltipContainer.id='tooltips';
  tooltipContainer.className='tooltips';
  return tooltipContainer;
}
function createTooltip(props={}) {  var tooltip=$create('DIV');
  tooltip.className='tooltips__tip';
  if (props.under) {    tooltip.classList.add('tooltips__tip--under');
  }
  if (props.className) {    tooltip.classList.add(props.className);
  }
  tooltip.id='tooltip_' + props.id;
  const container=props.container || $id('tooltips');
  container.appendChild(tooltip);
  return tooltip;
}
function createTooltipTitle(props={}) {  var tooltipTitle=$create('DIV');
  tooltipTitle.className='tooltips__tip__title';
  if (props.className) {    tooltipTitle.classList.add(props.className);
  }
  tooltipTitle.innerHTML=props.children;
  return tooltipTitle;
}
function createTooltipBody(props={}) {  var tooltipBody=$create('DIV');
  tooltipBody.className='tooltips__tip__body';
  if (props.className) {    tooltipBody.classList.add(props.className);
  }
  if (typeof props.children === 'object') {    tooltipBody.appendChild(props.children);
  } else {    tooltipBody.innerHTML=props.children;
  }
  return tooltipBody;
}
function createTooltipClose(props={}) {  var tooltipClose=$create('DIV');
  var tooltipCloseIcon=$create('I');
  tooltipClose.className='tooltips__tip__close';
  tooltipClose.onclick=props.onClick || function () {    tgEvents.publish(tooltips.TOOLTIP_CLOSED, props.id);
  };
  tooltipCloseIcon.className='tg-icon remove';
  tooltipClose.appendChild(tooltipCloseIcon);
  return tooltipClose;
}
/**
 * @typedef {Object} TooltipOffsets
 * @property {Number} top
 */
/**
 * The props supported by TooltipComponent
 * @typedef {Object} TooltipProps
 * @property {String} position - default, right
 * @property {TooltipOffsets}
 */
/**
 * @param {Element} tooltip - Tooltip component Element Node
 * @param {Object} parent
 * @param {string} parent.selector - query select to position tooltip
 * @param {boolean} parent.under - whether to position under or above the parent
 * @param {TooltipProps} props
 */
function TooltipComponent(tooltip, parent, props={}) {  this.tooltip=tooltip;
  this.parent=parent;
  this.props=props;
}
TooltipComponent.prototype.addClass=function(className) {  this.tooltip.classList.add(className);
  return this;
}
TooltipComponent.prototype.removeClass=function(className) {  this.tooltip.classList.remove(className);
  return this;
}
TooltipComponent.prototype.reposition=function () {  var elementPos=document
    .querySelector(this.parent.selector)
    .getBoundingClientRect();
  var tooltipPos=this.tooltip.getBoundingClientRect();
  this.tooltip.style.top =
    elementPos.top +
    (this.parent.under ? elementPos.height : 0) +
    (!this.parent.under ? -tooltipPos.height : 0) +
    (this.props.offsets && this.props.offsets.top || 0) +
    'px';
  this.removeClass('tooltips__tip--position-default');
  this.removeClass('tooltips__tip--position-right');
  if (this.props.fixed) {    this.addClass('tooltips__tip--is-fixed');
  }
  if (!this.props.position || this.props.position === 'default') {    this.tooltip.style.left=elementPos.left - 75 + elementPos.width / 2 + 'px';
    this.addClass('tooltips__tip--position-default');
  }
  if (this.props.position === 'right') {    var leftEdge=elementPos.left - 75;
    if (this.props.fixed) {      leftEdge += 75;
    }
    var edgeDiff=tooltipPos.width - elementPos.width;
    this.tooltip.style.left=(leftEdge - edgeDiff)  + 'px';
    this.addClass('tooltips__tip--position-right');
  }};
TooltipComponent.prototype.show=function () {  var reposition=this.reposition.bind(this);
  setTimeout(function () {    requestAnimationFrame(reposition);
  }, 0);
  this.tooltip.classList.add('tooltips__tip--visible');
};
TooltipComponent.prototype.hide=function () {  this.tooltip.classList.remove('tooltips__tip--visible');
};
function createAddTaskTooltip(id) {  var tooltip=createTooltip({    id: id,
    className: 'tooltips__tip--add-tasks',
    under: true,
  });
  tooltip.appendChild(
    createTooltipTitle({children: 'Now, create more tasks for your project!'})
  );
  var addTaskDetails=$create('DIV');
  addTaskDetails.className='tooltips__tip__add-tasks';
  function createIconItem(props) {    var iconItem=$create('DIV');
    iconItem.className='tooltips__tip__add-tasks__item';
    iconItem.appendChild(
      createIcon({boxShadow: props.iconBoxShadow, icon: props.icon})
    );
    var iconItemDescription=$create('DIV');
    iconItemDescription.className =
      'tooltips__tip__add-tasks__item__description';
    iconItemDescription.innerHTML=props.description;
    iconItem.appendChild(iconItemDescription);
    return iconItem;
  }
  function createIcon(props) {    var taskIcon=$create('DIV');
    var baseClassName='tooltips__tip__add-tasks__item__icon';
    taskIcon.className=baseClassName;
    taskIcon.style.boxShadow=props.boxShadow;
    var taskIconShape=$create('DIV');
    taskIconShape.className=baseClassName + '--' + props.icon;
    taskIcon.appendChild(taskIconShape);
    return taskIcon;
  }
  addTaskDetails.appendChild(
    createIconItem({      icon: 'task',
      iconBoxShadow:
        'inset 0 1px 3px 0 rgba(255,255,255,0.07), 0 12px 34px 0 rgba(0,173,238,0.27)',
      description:
        '<span style="color: #2783FE; font-weight: 500;">Task.</span> Work that needs to be done. <em>i.e. Design home page, Build foundation</em>',
    })
  );
  addTaskDetails.appendChild(
    createIconItem({      icon: 'milestone',
      iconBoxShadow:
        'inset 0 1px 3px 0 rgba(255,255,255,0.07), 0 12px 34px 0 rgba(255,174,48,0.16)',
      description:
        '<span style="color: #FFAE30; font-weight: 500;">Milestone.</span> A specific marker in your project. <em>i.e. Design complete, Phase 1 finished</em>',
    })
  );
  addTaskDetails.appendChild(
    createIconItem({      icon: 'group',
      iconBoxShadow:
        'inset 0 1px 3px 0 rgba(255,255,255,0.07), 0 12px 34px 0 rgba(255,152,122,0.2)',
      description:
        '<span style="color: #FF987A; font-weight: 500;">Group of Tasks.</span> Used to organize a group of tasks. <em>i.e. Design phase, Research</em>',
    })
  );
  var addTaskDetailsBodyWrapper=$create('DIV');
  addTaskDetailsBodyWrapper.appendChild(addTaskDetails);
  var addTaskDetailsQuickTip=$create('DIV');
  addTaskDetailsQuickTip.className='tooltips__tip__add-tasks__quick-tip';
  addTaskDetailsQuickTip.innerHTML =
    '<span style="font-weight: 500;"> Quick Tip:</span>  Hit enter after creating a task to create a new task under it.';
  addTaskDetailsBodyWrapper.appendChild(addTaskDetailsQuickTip);
  tooltip.appendChild(
    createTooltipBody({      children: addTaskDetailsBodyWrapper,
    })
  );
  tooltip.appendChild(createTooltipClose({id: id}));
  return new TooltipComponent(tooltip, {    selector: '.quick_add_task',
    under: true,
  });
}
function createRenameGroupTooltip(id) {  var tooltip=createTooltip({    id: id,
  });
  tooltip.appendChild(
    createTooltipTitle({children: 'Name your first group of tasks.'})
  );
  tooltip.appendChild(
    createTooltipBody({      children:
        'Groups are used to organize the tasks in your project. For example: <em>Design phase, Research stage, Pre-construction</em>, etc.',
    })
  );
  tooltip.appendChild(createTooltipClose({id: id}));
  return new TooltipComponent(tooltip, {    selector: '.category_name',
    under: false,
  });
}
function createRenameTaskTooltip(id) {  var tooltip=createTooltip({    id: id,
    under: true,
  });
  tooltip.style.lineHeight='14px';
  tooltip.style.paddingRight='22px';
  tooltip.appendChild(
    createTooltipBody({      children: 'Great! Now, rename your first task.',
    })
  );
  tooltip.appendChild(createTooltipClose({id: id}));
  return new TooltipComponent(tooltip, {selector: '.task_name', under: true});
}
(function (global) {  var COLLABORATOR_PREFERENCE_KEY='app.web.closedToolTips.managerGanttInvitePeople';
  /**
   * Store a preference for dismissing the collaborator tooltip then hide
   * it from view
   */
  function dismissCollaboratorTooltip(component) {    update_preference_new({      key: COLLABORATOR_PREFERENCE_KEY,
      type: 'boolean',
      value: true,
    });
    component.hide();
  }
  /**
   * Call a function when the given selector indicates a visible
   * element in the dom.
   */
  function whenElementReady(selector, cb) {    let observer=new IntersectionObserver((entries, self) => {      entries.forEach((entry) => {        if (entry.isIntersecting) {          cb(entry.target);
          self.disconnect();
        }
      });
    });
    observer.observe(document.querySelector(selector));
  }
  /**
   * Render the invite collaborators tooltip
   */
  function renderInviteCollaborators() {    var id='invite_collaborators';
    var tooltip=createTooltip({      container: document.body,
      id: id,
      className: 'tooltips__tip--invite-collaborators',
      under: true,
    });
    tooltip.appendChild(createTooltipTitle({children: 'Did you know?'}));
    tooltip.appendChild(
      createTooltipBody({        children: 'Collaborators are free! Invite your team at no additional cost.'
      })
    );
    const component=new TooltipComponent(
      tooltip,
      {        selector: '#invite_button',
        under: true,
      },
      {        fixed: true,
        position: 'right',
        offsets: {          top: 10,
        }
      }
    );
    tooltip.appendChild(createTooltipClose({      id: id,
      onClick: function () {        dismissCollaboratorTooltip(component);
      }
    }));
    return component;
  }
  /**
   * Render all pricing related tooltips
   */
  function main(details) {    whenElementReady('#invite_button', (inviteButton) => {      // Only show if ten or more tasks are present
      if (window._tasks.length < 10 || window._projects.length === 0) {        return;
      }
      // Only show if the plan involves manager pricing
      if (!/50[\d]+(?:m|y)/i.test(window._projects[0].company_plan_code)) {        return;
      }
      // Only render if the user hasn't dismissed the tooltip
      var user=details[0];
      var preferences=user.preferences_new || [];
      var preference=preferences.find(({key}) => key === COLLABORATOR_PREFERENCE_KEY);
      if (!preference || preference.value !== true) {        var component=renderInviteCollaborators();
        component.show();
        inviteButton.addEventListener('click', () => dismissCollaboratorTooltip(component));
      }
    });
  }
  tgEvents.subscribeAll([tgEvents.CURRENT_USER_LOADED, tgEvents.GANTT_LOADED], main)
})(window);
/**
 * @typedef TooltipDefinition
 * @type {object}
 * @property {string} id - tooltip id
 * @property {string} eventName - tgEvents event to listen for
 * @property {Function} render - function to create the tooltip UI
 * @property {string} [segmentEvent] - event name to fire when tooltip is completed
 * @property {number} [count=1] - wait until this number to advance to the next tip
 */
/** @type {TooltipDefinition[]} */
var _tooltips=[
  {    id: 'rename-group-tooltip',
    eventName: tgEvents.GROUP_RENAMED,
    render: createRenameGroupTooltip,
  },
  {    id: 'rename-task-tooltip',
    eventName: tgEvents.TASK_RENAMED,
    render: createRenameTaskTooltip,
  },
  {    id: 'add-5-tasks-tooltip',
    eventName: tgEvents.TASK_ADDED,
    render: createAddTaskTooltip,
  },
];
var TOOLTIP_PREFERENCE_KEY='app.gantt.lastTooltipId';
/**
 * Tooltips
 * @param {string} [lastTooltipId]
 */
function Tooltips(lastTooltipId) {  this.TOOLTIP_CLOSED='tooltip_closed';
  var initialIndex=this.getInitialIndex(lastTooltipId);
  if (initialIndex === _tooltips.length) {    return;
  }
  /**
   * @type {number} - holds the number of times the handler was called
   */
  this.count=0;
  /**
   * @type {number} - holds the current active index
   */
  this.activeIndex=0;
  this.tooltipsContainer=createTooltipContainer();
  document.body.appendChild(this.tooltipsContainer);
  /**
   * @type {TooltipComponent[]}
   */
  this.tooltips=_tooltips.map(function (def) {    return def.render(def.id);
  }, []);
  this.removeCloseListener=tgEvents.subscribe(
    this.TOOLTIP_CLOSED,
    this.onTooltipClosed.bind(this)
  );
  /**
   * Creates the event listeners and stores their unsubscribe functions.
   * @type {Function[]}
   */
  this.removeListeners=_tooltips.map(this.makeSubscription.bind(this));
  this.activateTooltip(initialIndex);
}
/**
 * Static method to determine if tooltips should be displayed or not
 * @returns Tooltip
 */
Tooltips.initialize=function () {  tgEvents.subscribeAll(
    [tgEvents.CURRENT_USER_LOADED, tgEvents.GANTT_LOADED],
    function (details) {      var projectPermission=_projects[0]['project_permission'];
      // Must be a project admin
      if (projectPermission !== 'admin') {        return;
      }
      var currentUser=details[0];
      // Must only be in one company
      if (currentUser.companies.length > 1) {        return;
      }
      var companyCreatedTime=new Date(
        currentUser.companies[0].time_stamp
      ).getTime();
      var companyCreatedHoursAgo =
        (new Date().getTime() - companyCreatedTime) / 1000 / 60 / 60;
      // Company must be less than 24 hours old
      if (companyCreatedHoursAgo > 24) {        return;
      }
      var isInTooltipExperiment=false;
      // Must be in tooltip experiment.
      // Checking this last so that only those in the A/B groups
      // have actually qualified for the test.
      if (!isInTooltipExperiment) {        return;
      }
      var lastTooltipId=currentUser.preferences_new.find(function (
        preference
      ) {        return preference.key === TOOLTIP_PREFERENCE_KEY;
      });
      window.tooltips=new Tooltips(
        lastTooltipId ? lastTooltipId.value : null
      );
    }
  );
};
/**
 * Helper method to bypass the criteria to display tooltips
 */
Tooltips.test=function () {  window.tooltips=new Tooltips();
};
/**
 * Activate a tooltip
 * @param {number} index
 */
Tooltips.prototype.activateTooltip=function (index) {  if(index === 0){    track_segment_event('first-onboarding-tooltip-shown');
    update_preference_new({      key: 'app.web.returnUrl',
      type: 'string',
      value: window.location.href,
    });
  }
  try {    this.activeIndex=index;
    this.count=0;
    this.tooltips[index].show();
  } catch {}};
Tooltips.prototype.getInitialIndex=function (lastTooltipId) {  // adding 1 to no index (-1) will activate the first tooltip (0)
  return (
    1 +
    _tooltips.findIndex(function (tip) {      return tip.id === lastTooltipId;
    })
  );
};
/**
 * Make callback for tgEvent handler
 * @param {TooltipDefinition} def
 * @param {number} index
 */
Tooltips.prototype.makeHandler=function (def, index) {  if (this.activeIndex !== index) {    return;
  }
  this.count++;
  if (def.count && this.count < def.count) {    this.repositionTooltip();
    return;
  }
  if (def.segmentEvent) {    track_segment_event(def.segmentEvent);
  }
  this.showNext();
};
/**
 * Subscribe to event and make callback
 * @param {TooltipDefinition} def
 * @param {number} index
 * @returns
 */
Tooltips.prototype.makeSubscription=function (def, index) {  return tgEvents.subscribe(
    def.eventName,
    this.makeHandler.bind(this, def, index)
  );
};
/**
 * Handles when a tooltip is closed
 * @param {string} id
 */
Tooltips.prototype.onTooltipClosed=function (id) {  var dismissedEventName=id + '-dismissed';
  track_segment_event(dismissedEventName);
  this.showNext();
};
/**
 * Remove tooltip event listeners
 * @param {number} index
 */
Tooltips.prototype.removeListener=function (index) {  this.removeListeners[index]();
};
/**
 * Repositions the tooltip relative to the parent element
 */
Tooltips.prototype.repositionTooltip=function () {  this.tooltips[this.activeIndex].reposition();
};
/**
 * Advance to the next tooltip, remove listener
 */
Tooltips.prototype.showNext=function () {  update_preference_new({    key: TOOLTIP_PREFERENCE_KEY,
    type: 'string',
    value: _tooltips[this.activeIndex].id,
  });
  this.tooltips[this.activeIndex].hide();
  this.removeListener(this.activeIndex);
  var nextIndex=this.activeIndex + 1;
  if (nextIndex === _tooltips.length) {    this.removeCloseListener();
    document.body.removeChild(this.tooltipsContainer);
    return;
  }
  this.activateTooltip(nextIndex);
};
(function () {  Tooltips.initialize();
})();
// JavaScript Document
function days_in_month(month, year)
{return 32 - new Date(year, month, 32).getDate();
}
function previous_days(month, year, days_back)
{return 32 - new Date(year, month-1, 32).getDate() - days_back;
}
function generate_calendar(input, position_element, disable_before, force_month, force_year)
{if(!$id(input.id+"_bg_cover"))
{var bg=$create("DIV");
bg.id=input.id+"_bg_cover";
bg.className="calendar_bg_cover";
bg.setAttribute("input_id", input.id);
bg.onclick=function() {destroy_calendar(this.getAttribute("input_id"));
};
document.body.appendChild(bg);
bring_to_front(bg);
}
position_element=position_element || input;
disable_before=disable_before || null;
force_month=parseInt(force_month) || null;
force_year=parseInt(force_year) || null;
var today=new Date();
var focus_date=null;
var year=null;
var month=null;
var day=null;
var today_year=today.getFullYear();
var today_month=to_two(today.getMonth()*1+1);
var today_day=today.getDate();
if(input.value == "" || input.value == "0000-00-00")
{year=today.getFullYear();
month=today.getMonth()*1 + 1;
day=today.getDate();
}
else
{if(input.getAttribute("raw_date") != undefined) {var values=input.getAttribute("raw_date").split("-");
} else {var values=input.value.split("-");
}
year=values[0];
month=values[1]*1;
day=values[2];
}
focus_date=year+"-"+to_two(month)+"-"+to_two(day);
if(force_month != null && force_year != null)
{year=force_year;
month=force_month;
day=null;
}
//BUILD CONTAINER
var div=$create("DIV");
div.id=input.id+"_calendar";
div.className="calendar_picker";
div.setAttribute("month", month);
div.setAttribute("year", year);
//POSITION THIS
if(position_element.x) {div.style.left=position_element.x+"px";
div.style.top=position_element.y+"px";
}
else {var position=real_position(position_element);
div.style.left=position.x+"px";
div.style.top=position.y+"px";
}
document.body.appendChild(div);
bring_to_front(div);
//TYPE CONTROLS
var placeholder_text='Type: "today", "tomorrow", "Wed", etc..';
var header=$create("INPUT");
header.id="calendar_type_text";
header.className="placeholder";
header.setAttribute("input_id", input.id);
header.setAttribute("disable_before", disable_before);
header.onchange=function() { calendar_check_input(this, this.getAttribute("input_id")); };
header.onkeyup=function() {this.className=(this.value == "") ? "placeholder" : "";
};
if(typeof _version != undefined && _version == "list_view" && input.parentNode.getAttribute("name") == "editable")
{header.onkeydown=function(event) {e=event;
var key=e.keyCode;
if(key == _master_keys['tab'])
{this.onchange();
if(_is_shift) {arrow_tab("previous", input.parentNode);
}
else {arrow_tab("next", input.parentNode);
}
return false;
}
else if(key == _master_keys['up'])
{this.onchange();
arrow_tab("up", input.parentNode);
return false;
}
else if(key == _master_keys['down'])
{this.onchange();
arrow_tab("down", input.parentNode);
return false;
}};
}
div.appendChild(header);
//CONTENT
var content=$create("DIV");
content.className="inner_content";
div.appendChild(content);
//CLEAR DATE
var c_div=$create("DIV");
c_div.className="clear_date";
var clear_date=$create("A");
clear_date.appendChild($text("(x) Clear Dates"));
clear_date.onclick=function() {var target=$id(input.id);
target.value="0000-00-00";
target.setAttribute("raw_date", target.value);
target.onchange();
if(typeof pretty_date == "function") {target.value=pretty_date(target.value);
}
destroy_calendar(target.id);
};
c_div.appendChild(clear_date);
content.appendChild(c_div);
//MONTH CHOOSER
var chooser=$create("DIV");
chooser.className="calendar_month_chooser";
content.appendChild(chooser);
//BACK YEAR
var back_month=$create("SPAN");
back_month.type="button";
back_month.className="back_year";
back_month.onclick=function() { calendar_change_month(-12, disable_before, $id(input.id+"_calendar")); };
var i=$create("I");
i.className="fa fa-play fa-rotate-180";
back_month.appendChild(i);
chooser.appendChild(back_month);
//BACK MONTH
var back_month=$create("SPAN");
back_month.type="button";
back_month.className="back_month";
back_month.onclick=function() { calendar_change_month(-1, disable_before, $id(input.id+"_calendar")); };
var i=$create("I");
i.className="fa fa-play fa-rotate-180";
back_month.appendChild(i);
chooser.appendChild(back_month);
//CURRENT MONTH
var month_names=["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var span=$create("SPAN");
span.appendChild($text(month_names[month]+" "+year));
chooser.appendChild(span);
//NEXT MONTH
var next_month=$create("SPAN");
next_month.type="button";
next_month.className="forward_month";
next_month.onclick=function() { calendar_change_month(1, disable_before, $id(input.id+"_calendar")); };
var i=$create("I");
i.className="fa fa-play";
next_month.appendChild(i);
chooser.appendChild(next_month);
//NEXT YEAR
var next_month=$create("SPAN");
next_month.type="button";
next_month.className="forward_year";
next_month.onclick=function() { calendar_change_month(12, disable_before, $id(input.id+"_calendar")); };
var i=$create("I");
i.className="fa fa-play";
next_month.appendChild(i);
chooser.appendChild(next_month);
//BUILD CALENDAR
var table=$create("TABLE");
table.className="calendar_table";
table.align="center";
table.setAttribute("cellpadding",0);
table.setAttribute("cellspacing",0);
table.setAttribute("cellspacing",0);
content.appendChild(table);
//DAY NAMES
var row=table.insertRow(0);
var the_days=["Su","Mo","Tu","We","Th","Fr","Sa"];
for(var i=0; i < the_days.length; i++)
{var cells=row.cells.length;
var cell=row.insertCell(cells);
cell.appendChild($text(the_days[i]));
cell.className="day_names";
}
//CALENDAR DATES
var right_now=new Date();
var force_date=new Date( right_now.setFullYear(year,month-1,1) );
var day_starts=force_date.getDay();
var rows=table.rows.length;
var row=table.insertRow(rows);
//PREVIOUS MONTH DAYS
for(var i=1; i <= day_starts; i++)
{var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month-1, previous_days(month-1, year, day_starts-i), $id(input.id), focus_date, disable_before);
cell.className += " other_month";
}
//THIS MONTH
for(var i=1; i <= days_in_month(month-1, year); i++)
{//CREATE NEW ROW IF NEEDED
var dow=new Date( right_now.setFullYear(year,month-1,i) ).getDay()+1;
if(dow % 7 == 1)
{var rows=table.rows.length;
var row=table.insertRow(rows);
}
var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month, i, $id(input.id), focus_date, disable_before);
//IF TODAY - HIGHLIGHT
if(year == today_year && month == today_month && i == today_day)
{cell.className += " today";
}}
if(dow != 7)
{var d=1;
for(i=dow; i < 7; i++)
{var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month+1, d, $id(input.id), focus_date, disable_before);
cell.className += " other_month";
d++;
}}
//NEXT MONTH
var next_month=month*1 + 1;
next_month=(next_month > 12) ? 1 : next_month;
var force_date=new Date( right_now.setFullYear(year,month,1) );
var day_starts=force_date.getDay();
var rows=table.rows.length;
var row=table.insertRow(rows);
var cell=row.insertCell(0);
cell.setAttribute("colspan",7);
cell.appendChild($text( month_names[next_month] ));
cell.className="no_hover";
var rows=table.rows.length;
var row=table.insertRow(rows);
for(var i=1; i <= day_starts; i++)
{var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month, previous_days(month, year, day_starts-i), $id(input.id), focus_date, disable_before);
cell.className += " other_month";
}

var month_days=days_in_month(month, year);
for(var i=1; i <= month_days; i++)
{//CREATE NEW ROW IF NEEDED
var dow=new Date( right_now.setFullYear(year,month,i) ).getDay()+1;
if(dow % 7 == 1)
{var rows=table.rows.length;
var row=table.insertRow(rows);
}
var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month+1, i, $id(input.id), focus_date, disable_before);
//IF TODAY - HIGHLIGHT
if(year == today_year && month+1 == today_month && i == today_day)
{cell.className += " today";
}}
if(dow != 7)
{var d=1;
for(i=dow; i < 7; i++)
{var cells=row.cells.length;
var cell=row.insertCell(cells);
display_day(cell, year, month+2, d, $id(input.id), focus_date, disable_before);
cell.className += " other_month";
d++;
}}
//OFFSET TOP
var cal_top=div.offsetTop*1;
var cal_height=450*0.6;
var cal_bottom=cal_top + cal_height;
var scroll_top=get_scrolltop();
var page_height=window_size("height")*1 + scroll_top;
var diff=page_height - cal_bottom;
if(diff < 0) {div.style.marginTop=Math.round(diff) +"px";
}
//FOCUS INPUT
header.focus();
return div;
}
function calendar_change_month(direction, disable_before, div)
{if(div)
{var left_margin=0;
var margin_left=div.getAttribute("margin_left");
if(margin_left && margin_left != "")
{left_margin=margin_left;
}
var month=div.getAttribute("month");
var year=div.getAttribute("year");
if(direction == -12)
{year--;
}
else if(direction == 12)
{year++;
}
else
{month=month*1 + direction;
if(month > 12)
{month=month % 12;
year++;
}
else if(month < 1)
{month=12;
year--;
}}
//REMOVE CURRENT CALENDAR
var cur_pos=real_position(div);
cur_pos.y=cur_pos.y - div.offsetHeight;
var input=$id(div.id.replace("_calendar",""));
div.parentNode.removeChild(div);
var cal=generate_calendar(input, cur_pos, disable_before, month, year);
if(left_margin > 0)
{cal.style.marginLeft=left_margin +"px";
cal.setAttribute("margin_left", left_margin);
}}
}
function display_day(cell, year, month, day, target, focus_date, disable_before)
{if(month == 0) {month=12;
year=year-1;
}
else if(month == 13) {month=1;
year++;
}
var date_value=year+"-"+to_two(month)+"-"+to_two(day);
cell.appendChild($text(day));
cell.setAttribute("date", date_value);
cell.onclick=function() {var value=this.getAttribute("date");
var pretty=(typeof pretty_date == "function") ? pretty_date(value) : value;
target.value=this.getAttribute("date");
target.setAttribute("raw_date", value);
if(typeof target.onchange == "function") {target.onchange();
}
//UPDATE SELECTED TEXT
if(target.tagName == "INPUT") {target.value=pretty;
}
else {target.firstChild.nodeValue=pretty;
}
destroy_calendar(target.id);
};
cell.className=(focus_date == date_value) ? "highlight" : "";
if(disable_before != null && disable_before.toString().replace(/-/g,"")*1 > date_value.replace(/-/g,"")*1) {cell.onclick=null;
cell.className="disable";
}}
function destroy_calendar(id)
{var cal=$id(id+"_calendar");
if(cal) {cal.parentNode.removeChild(cal);
}
var cover=$id(id+"_bg_cover");
if(cover) {cover.parentNode.removeChild(cover);
}
if(_version && _version == "list_view") {$id(id).parentNode.setAttribute("allow_date",1);
}}
function calendar_check_input(ele, input_id)
{var ajaxRequest;  // The variable that makes Ajax possible!
try
{// Opera 8.0+, Firefox, Safari
ajaxRequest=new XMLHttpRequest();
}
catch (e)
{// Internet Explorer Browsers
try
{ajaxRequest=new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e)
{try
{ajaxRequest=new ActiveXObject("Microsoft.XMLHTTP");
}
catch (e)
{// Something went wrong
alert("Your browser broke!");
return false;
}}
}
// Create a function that will receive data sent from the server
ajaxRequest.onreadystatechange=function()
{if(ajaxRequest.readyState != 4)
{}
else if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200)
{var return_date=ajaxRequest.responseText;
if(return_date == "") {custom_alert("Unabled to determine the date you entered. Please try again.");
}
else {var target=$id(input_id);
target.value=return_date;
target.setAttribute("raw_date", target.value);
target.onchange();
if(typeof pretty_date == "function") {target.value=pretty_date(target.value);
}
destroy_calendar(target.id);
}}
else { }}

if(ele.value != "")
{var queryString="dt="+tweak_text_for_get(ele.value);
if(ele.getAttribute("disable_before") != "" && ele.getAttribute("disable_before") != null && ele.getAttribute("disable_before") != "null")
{queryString += "&disable_before="+tweak_text_for_get(ele.getAttribute("disable_before"));
}
ajaxRequest.open("POST", "/gantt/functions_text_to_date.php", true);
ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
ajaxRequest.send(queryString);
}
else
{var target=$id(input_id);
destroy_calendar(target.id);
}}////// ADD CONTROLS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//QUICK ADD
function super_quick_add(adding, id) {  if (adding == 'task' || adding == 'milestone') {    //FIND THE LAST TASK IN THE GROUP
    var group_target_divs=$id('group_target_' + id)
      ? $id('group_target_' + id).getElementsByTagName('DIV')
      : $id('category_target_' + id).getElementsByTagName('DIV');
    var last=[];
    last['type']='task'; // DEFAULT TASK IN CASE THERE IS NOTHING IN THE GROUP
    last['id']='-1'; //DEFAULT TO -1 IN CASE THERE IS NOTHING IN THE GROUP
    last['open']=''; //ONLY NEEDED FOR GROUPS - TASKS WILL IGNORE
    for (var d=0; d < group_target_divs.length; d++) {      var div=group_target_divs[d];
      if (
        div.getAttribute('task_id') != undefined &&
        div.getAttribute('task_id') != null &&
        div.getAttribute('task_id').indexOf('quick_add') == -1
      ) {        var task_id=div.getAttribute('task_id');
        var task=_tasks[_tasks_key[task_id]];
        if (!task['show_task']) {          continue;
        }
        last['type']='task';
        last['id']=task_id;
        last['hidden']='';
      } else if (
        div.getAttribute('group_id') != undefined &&
        div.getAttribute('group_id') != null &&
        div.getAttribute('target') == 'group' &&
        div.id.indexOf('category_') == 0
      ) {        var group_id=div.getAttribute('group_id');
        var group=_groups[_groups_key[group_id]];
        if (!group['visible']) {          continue;
        }
        last['type']='group';
        last['id']=div.getAttribute('group_id');
        last['hidden']=div.getAttribute('group_hidden');
      }
    }
    if (last['type'] == 'group' && last['hidden'] == '1') {      //IF THE LAST ITEM IS A CLOSED SUBGROUP - ADD TO THE PARENT GROUP
      quick_add(
        adding,
        'group',
        _groups[_groups_key[last['id']]]['parent_group_id']
      );
    } else if (last['type'] == 'group' && last['hidden'] == '0') {      //IF THE LAST ITEM IS A SUBGROUP AND IT'S OPEN - PUT IT IN THERE
      quick_add(adding, 'group', last['id']);
    } else if (last['type'] == 'task') {      //IF LAST IS A TASK - PROCEED
      var last_task_id=last['id'];
      if (last_task_id != -1) {        var all_open=true;
        var all_parents=[];
        var group_id=_tasks[_tasks_key[last_task_id]]['group_id'];
        //MAKE SURE TASK ISN'T GETTING ADDED TO A COLLAPSED GROUP
        while (group_id != '') {          var hidden=_groups[_groups_key[group_id]]['group_hidden'];
          hidden=hidden == '' ? 0 : hidden;
          all_parents.push([group_id, hidden]);
          group_id=_groups[_groups_key[group_id]]['parent_group_id'];
          if (hidden != 0) {            all_open=false;
          }
        }
        //IF ALL SUBGROUPS ARE OPEN - NO NEED TO RUN THIS
        if (all_open == false) {          var use_group=null;
          for (i=all_parents.length - 1; i >= 0; i--) {            if (all_parents[i][1] == 1) {              i=-1;
            } else {              use_group=all_parents[i][0];
              last_task_id=-1;
              id=use_group;
            }
          }
        }
      }
      if (last_task_id == -1) {        quick_add(adding, 'group', id);
      } else {        quick_add(adding, 'task', last_task_id);
      }
    }
  } else if (adding == 'group') {    quick_add_group(id);
  }}
function set_save_quick_add(queryString, temp_task_id, task_name, add_after) {  setTimeout(function () {    var task_name =
      $id('task_name_' + temp_task_id) &&
      $id('task_name_' + temp_task_id).firstChild
        ? $id('task_name_' + temp_task_id).firstChild.nodeValue
        : '';
    if (task_name == '') {      //CLEAR THE INPUT
      var eles=[
        $id('task_meta_' + temp_task_id),
        $id('task_title_' + temp_task_id),
        $id('task_' + temp_task_id),
      ];
      for (var e=0; e < eles.length; e++) {        if (eles[e]) {          eles[e].parentNode.removeChild(eles[e]);
        }
      }
      //RESET CRITICAL PATHS
      load_critical_paths();
      allow_hover=true;
      unhighlight_all();
    } else {      save_quick_add(queryString, temp_task_id, task_name, add_after);
    }
  }, 1);
}
function get_group_child_count(group_id) {  var count=0;
  for (var i=0; i < _tasks.length; i++) {    var t=_tasks[i];
    if (t['group_id'] == group_id) {      count++;
    }
  }
  for (var i=0; i < _groups.length; i++) {    var g=_groups[i];
    if (g['parent_group_id'] == group_id) {      count++;
    }
  }
  return count;
}
/**
 * When a task is added to a group, we need to increment the sort position of all siblings that are under the newly created task.
 *
 * @param {int} groupId
 * @param {int} taskId
 * @param {int} sort
 */
function increment_sibling_sort(groupId, taskId, sort) {  var siblingTasksAfterSort=_tasks.filter(
    (t) =>
      t['task_id'] &&
      t['group_id'] &&
      t['sort_order'] &&
      t['task_id'] != taskId && // == is on purpose
      t['group_id'] == groupId && // == is on purpose
      t['sort_order'] >= sort
  );
  siblingTasksAfterSort.map(
    (t) => _tasks[_tasks_key[t['task_id']]]['sort_order']++
  );
  var siblingGroupsAfterSort=_groups.filter(
    (g) =>
      g['parent_group_id'] &&
      g['sort_order'] &&
      g['parent_group_id'] == groupId && // == is on purpose
      g['sort_order'] >= sort
  );
  siblingGroupsAfterSort.map(
    (g) => _groups[_groups_key[g['group_id']]]['sort_order']++
  );
}
function save_quick_add(queryString, temp_task_id, task_name, add_after) {  add_after=add_after || '';
  // Create a function that will receive data sent from the server
  var callback=function (response) {    if (response.ok) {      var t=response.json;
      tgEvents.publish(tgEvents.TASK_ADDED, {id: t.id, name: t.name});
      //RETURN VARIABLES
      var task_id='' + t.id;
      var company_id='' + t.company_id;
      var return_group_id='' + t.parent_group_id;
      var start_date=t.start_date;
      var end_date=t.end_date;
      var total_days=t.days;
      var weeks=0;
      var days=t.days;
      var color=t.color;
      var sort=t.sort;
      //FLIP TASK IDs
      _tasks[_tasks_key[temp_task_id]]['task_id']=task_id;
      _tasks_key[task_id]=_tasks_key[temp_task_id];
      _tasks[_tasks_key[task_id]]['sort_order']=sort;
      increment_sibling_sort(t.parent_group_id, t.id, sort);
      delete _tasks_key[temp_task_id];
      if (_version == 'gantt_chart') {        //UPDATE ELEMENT NODE VALUES (META COLUMN)
        document
          .getElementById('task_meta_' + temp_task_id)
          .classList.remove('pending');
        if ($id('meta_data')) {          var elements=$id(
            'category_meta_target_' + return_group_id
          ).getElementsByTagName('*');
          for (var e=0; e < elements.length; e++) {            if (elements[e].id.indexOf(temp_task_id) > -1) {              elements[e].id=elements[e].id.replace(temp_task_id, task_id);
            }
            if (
              elements[e].hasAttribute('task_id') &&
              elements[e].getAttribute('task_id').indexOf(temp_task_id) > -1
            ) {              elements[e].setAttribute('task_id', task_id);
            }
            if (
              elements[e].hasAttribute('target_id') &&
              elements[e].getAttribute('target_id').indexOf(temp_task_id) > -1
            ) {              elements[e].setAttribute('target_id', task_id);
            }
            if (
              elements[e].hasAttribute('type_id') &&
              elements[e].getAttribute('type_id').indexOf(temp_task_id) > -1
            ) {              elements[e].setAttribute('type_id', task_id);
            }
          }
        }
        //UPDATE ELEMENT NODE VALUES (TASK NAME COLUMN)
        document
          .getElementById('task_title_' + temp_task_id)
          .classList.remove('pending');
        var elements=$id(
          'group_target_' + return_group_id
        ).getElementsByTagName('*');
        for (var e=0; e < elements.length; e++) {          if (elements[e].id.indexOf(temp_task_id) > -1) {            elements[e].id=elements[e].id.replace(temp_task_id, task_id);
          }
          if (
            elements[e].hasAttribute('task_id') &&
            elements[e].getAttribute('task_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('task_id', task_id);
          }
          if (
            elements[e].hasAttribute('target_id') &&
            elements[e].getAttribute('target_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('target_id', task_id);
          }
          if (
            elements[e].hasAttribute('type_id') &&
            elements[e].getAttribute('type_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('type_id', task_id);
          }
        }
        //UPDATE ELEMENT NODE VALUES (RIGHT COLUMN)
        document
          .getElementById('task_' + temp_task_id)
          .classList.remove('pending');
        var elements=$id(
          'group_bar_target_' + return_group_id
        ).getElementsByTagName('*');
        for (var e=0; e < elements.length; e++) {          if (elements[e].id.indexOf(temp_task_id) > -1) {            elements[e].id=elements[e].id.replace(temp_task_id, task_id);
          }
          if (
            elements[e].hasAttribute('task_id') &&
            elements[e].getAttribute('task_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('task_id', task_id);
          }
          if (
            elements[e].hasAttribute('target_id') &&
            elements[e].getAttribute('target_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('target_id', task_id);
          }
          if (
            elements[e].hasAttribute('type_id') &&
            elements[e].getAttribute('type_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('type_id', task_id);
          }
        }
      } else if (_version == 'list_view') {        //UPDATE ELEMENT NODE VALUES (TASK NAME COLUMN)
        var elements=$id(
          'category_target_' + return_group_id
        ).getElementsByTagName('*');
        for (var e=0; e < elements.length; e++) {          if (elements[e].id.indexOf(temp_task_id) > -1) {            elements[e].id=elements[e].id.replace(temp_task_id, task_id);
          }
          if (
            elements[e].hasAttribute('task_id') &&
            elements[e].getAttribute('task_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('task_id', task_id);
          }
          if (
            elements[e].hasAttribute('target_id') &&
            elements[e].getAttribute('target_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('target_id', task_id);
          }
          if (
            elements[e].hasAttribute('type_id') &&
            elements[e].getAttribute('type_id').indexOf(temp_task_id) > -1
          ) {            elements[e].setAttribute('type_id', task_id);
          }
        }
      }
      //IF STRAIGHT TO DRAWING THE TASK
      if (_draw_task == temp_task_id) {        _draw_task=task_id;
      }
      //IF TYPED FASTER THAN SAVED - REFIRE THE SAVE
      if (_tasks[_tasks_key[task_id]]['estimated_hours'] != 0) {        _tasks[_tasks_key[task_id]]['estimated_hours']='';
        $id('task_estimated_hours_' + task_id).onblur();
      }
      //IF ASSIGNED RESORUCES - OPEN IT UP
      if (typeof _tasks[_tasks_key[task_id]]['save_do_focus'] == 'object') {        _tasks[_tasks_key[task_id]]['save_do_focus'].click();
        delete _tasks[_tasks_key[task_id]]['save_do_focus'];
        _after_save_ele=null;
      }
      //IF TYPED FASTER THAN SAVED - REFIRE THE SAVE
      if (_tasks[_tasks_key[task_id]]['percent_complete'] != 0) {        _tasks[_tasks_key[task_id]]['percent_complete']='';
        $id('task_percent_input_' + task_id).onblur();
      }
      //RESAVE TASK DATES IF IT WAS TOO QUICK
      if (
        _tasks[_tasks_key[task_id]]['start_date'] != '' &&
        _tasks[_tasks_key[task_id]]['end_date'] != ''
      ) {        //UPDATE THE ELEMENT
        var ele=$id('task_div_' + task_id);
        update_position(
          ele,
          'task',
          _tasks[_tasks_key[task_id]]['start_date'],
          _tasks[_tasks_key[task_id]]['end_date']
        );
        //FIRE OFF THE SAVE
        var save_string =
          task_id +
          ':' +
          _tasks[_tasks_key[task_id]]['start_date'] +
          ',' +
          _tasks[_tasks_key[task_id]]['end_date'];
        save_value('task_dates', 'dates', save_string);
      }
      //IF OPENED COMMENT/DOCUMENT WINDOW
      if (
        $id('meta_popup') &&
        $id('meta_popup').className.indexOf('hidden') == -1
      ) {        var which=$id('meta_left_tab').firstChild.className;
        if (which == 'discussion') {          load_note(
            'task',
            task_id,
            'note_viewer',
            $id('task_meta_comment_' + task_id)
          );
        } else if (which == 'discussion-attachment') {          load_documents(
            'task',
            task_id,
            'document_viewer',
            $id('task_meta_document_' + task_id)
          );
        }
      }
      //IF ADDING ANOTHER
      if (_tooltip_progress > 2 || _tooltip_progress == null) {        if (add_after == 'task' || add_after == 'milestone') {          attempt_add_next_task(add_after, 'task', task_id);
        }
      } else if (_tooltip_progress <= 2) {        //LOAD NEXT TOOL TIP
        if (_tooltip_step == 'add_task' && _tooltip_progress == 2) {          _tooltip_force_task =
            _tasks[_tasks_key[task_id]]['task_type'].toLowerCase() == 'task'
              ? task_id
              : null;
          load_next_tooltip();
        }
      }
    } else if (response.status === 402) {      var json=JSON.parse(response.response);
      var symbol=json.error ? json.error.symbol : null;
      var failed_new_task=_tasks[_tasks_key[temp_task_id]];
      var failed_task_project=_projects[_projects_key[failed_new_task['project_id']]];
      var failed_task_company_id=failed_task_project['company_id'] || null;
      if (symbol === 'task_limit_reached' && failed_task_company_id !== null) {        open_go_premium('task_limit_reached', failed_task_company_id);
        return;
      }
      var okayButton=custom_alert(json.error.message);
      okayButton.onclick=function () {        load_gantt();
        this.ondblclick();
      };
    } else {      authenticate_error();
    }
  };
  queryString += '&task_name=' + tweak_text_for_get(task_name);
  // INITIALIZE JSON API PARAMS
  var params={};
  var queryParts=queryString.split('&');
  for (var i=0; i < queryParts.length; i++) {    var param=queryParts[i].split('=');
    params[param[0]]=param[1];
  }
  // GET PROJECT AND PARENT GROUP ID
  var after=params.after.split(':');
  var after_type=after[0];
  var after_id=after[1];
  var after_id_parent=after[2];
  var after_target =
    after_type === 'group'
      ? _groups[_groups_key[after_id]]
      : _tasks[_tasks_key[after_id]];
  params.project_id=parseInt(after_target['project_id']);
  params.parent_group_id=parseInt(
    after_type === 'group' ? after_id : after_target['group_id']
  );
  params.sort =
    after_type === 'group'
      ? get_group_child_count(after_id) + 1
      : after_target['sort_order'] + 1;
  if (after_id_parent === '-1' && after_type === 'group') {    params.sort=1;
  }
  params.type=params.task_type.toLowerCase();
  // use `task_name` variable instead of trying to parse from querystring.
  // resolves encoding issues.
  params.name=task_name;
  if (params.start && params.start !== '-1') {    params.start_date=params.start;
  }
  if (params.start && params.end && params.start !== '-1') {    params.end_date=params.end;
  }
  create_target('task', params, callback);
}
function attempt_add_next_task(add_after, type, task_id) {  if (is_new_task_form_opened()) {    return;
  }
  quick_add(add_after, type, task_id);
}
function is_new_task_form_opened() {  var id_string='task_title_new-task_' + _new_task_count;
  return document.getElementById(id_string) ? true : false;
}
function switch_task(id) {  var task=_tasks[_tasks_key[id]];
  if (task['task_type'] == 'Task') {    //GET NAME
    var name=$id('task_name_' + id).firstChild.nodeValue;
    //DELETE CURRENT ROW
    $id('task_name_' + id).firstChild.nodeValue='';
    //RE ADD ROW (use timeout to break the loop)
    setTimeout(function () {      quick_add('milestone', task['add_after'], task['add_after_id'], name);
    }, 250);
  } else if (task['task_type'] == 'Milestone') {    //GET NAME
    var name=$id('task_name_' + id).firstChild.nodeValue;
    //DELETE CURRENT ROW
    $id('task_name_' + id).firstChild.nodeValue='';
    //RE ADD ROW (use timeout to break the loop)
    setTimeout(function () {      quick_add('task', task['add_after'], task['add_after_id'], name);
    }, 250);
  }}
var _new_task_count=0;
function quick_add(what, type, id, force_name) {  _new_task_count++;
  force_name=force_name || '';
  if (id.indexOf('new-task') == -1) {    //DEFAULT VARIABLES
    var original_id=id;
    var queryString='';
    //GET VALUES
    if (type == 'task') {      var group_id=_tasks[_tasks_key[id]]['group_id'];
      var project_id=_tasks[_tasks_key[id]]['project_id'];
    } else if (type == 'group') {      var group_id=id.split(':')[0];
      var project_id=_groups[_groups_key[group_id]]['project_id'];
    }
    //SET START & END DATE
    var start_date='';
    var end_date='';
    var total_days=0;
    var weeks=0;
    var days=0;
    var task_type=what == 'milestone' ? 'Milestone' : 'Task';
    var queryString='';
    //BUILD QUERYSTRING
    if (type == 'task') {      queryString='what=quick_add_task';
      queryString += '&task_type=' + task_type;
      queryString += '&after=' + type + ':' + id;
      queryString += '&color=' + _default_color;
      if (
        _projects[_projects_key[project_id]]['project_enable_hours'] == 1 ||
        _version == 'list_view'
      ) {        var start_date='';
        var end_date='';
        queryString += '&start=-1';
      } else if ($id('quick_add_sames_as_above').checked == true) {        var start_date=_tasks[_tasks_key[id]]['start_date'];
        var end_date=_tasks[_tasks_key[id]]['end_date'];
        total_days=_tasks[_tasks_key[id]]['total_days'];
        if (task_type == 'Milestone') {          start_date=end_date;
          total_days=1;
        }
        queryString += '&start=' + start_date;
        queryString += '&end=' + end_date;
      }
    } else if (type == 'group') {      queryString='what=quick_add_task';
      queryString += '&task_type=' + task_type;
      queryString += '&after=' + type + ':' + id;
      queryString += '&color=' + _default_color;
      if (
        _projects[_projects_key[_groups[_groups_key[group_id]]['project_id']]][
          'project_enable_hours'
        ] == 1 ||
        _version == 'list_view'
      ) {        //IF HOURLY SCHEDULING ENABLED ON THE PROJECT - DO NOT SCHEDULE THE DATES
        queryString += '&start=-1';
      } else if (
        _groups[_groups_key[group_id]]['min_date'] == '' ||
        _groups[_groups_key[group_id]]['min_date'] == null
      ) {        var day_width=_day_width[$id('zoom').value];
        var from_left=$id('tasks').scrollLeft * 1 + day_width * 7;
      }
    }
    //MAKE FAKE TASK
    var task_id='new-task_' + _new_task_count;
    var task=new Array();
    task['task_id']=task_id;
    task['task_name']=force_name;
    task['project_id']=project_id;
    task['group_id']=group_id;
    task['start_date']=start_date;
    task['end_date']=end_date;
    task['percent_complete']='0';
    task['total_days']=total_days;
    task['weeks']=weeks;
    task['days']=days;
    task['estimated_hours']=0;
    task['assigned_hours']=0;
    task['actual_hours']=0;
    task['task_type']=task_type;
    task['color']=_default_color;
    task['editable']='1';
    task['show_task']='1';
    task['resources']=new Array();
    task['critical_paths']=new Array();
    task['critical_paths_data']=[];
    task['user_resources']=[];
    task['company_resources']=[];
    task['custom_resources']=[];
    task['comment_count']=0;
    task['comment_edit_date']='';
    task['user_comment_edit_date']='';
    task['document_count']=0;
    task['document_edit_date']='';
    task['user_document_edit_date']='';
    task['queryString']=queryString;
    task['add_after']=type;
    task['add_after_id']=id;
    var tlen=_tasks.length;
    _tasks[tlen]=task;
    _tasks_key[task_id]=tlen;
    if (_version == 'gantt_chart') {      var parents=[];
      parents['meta']=$id('category_meta_target_' + group_id);
      parents['left']=$id('group_target_' + group_id);
      parents['right']=$id('group_bar_target_' + group_id);
      var t=display_tasks(task, parents);
      var task_meta=t[2];
      var task_name=t[0];
      var task_bar=t[1];
      if (type == 'task') {        if ($id('task_title_' + id).nextSibling) {          if (task_meta) {            task_meta.parentNode.insertBefore(
              task_meta,
              $id('task_meta_' + id).nextSibling
            );
          }
          task_name.parentNode.insertBefore(
            task_name,
            $id('task_title_' + id).nextSibling
          );
          task_bar.parentNode.insertBefore(
            task_bar,
            $id('task_' + id).nextSibling
          );
        } else {          if (task_meta) {            task_meta.parentNode.insertBefore(
              task_meta,
              $id('task_meta_quick_add_' + id)
            );
          }
          task_name.parentNode.insertBefore(
            task_name,
            $id('task_title_quick_add_' + id)
          );
          task_bar.parentNode.insertBefore(
            task_bar,
            $id('task_quick_add_' + id)
          );
        }
      } else if (type == 'group') {        if (_groups[_groups_key[group_id]['group_hidden']] != 0) {          hide_group(group_id, 0);
          save_value('group-hide', group_id, '');
        }
        if (original_id.indexOf('-1') == -1) {          if (
            $id('group_target_' + group_id).childNodes.length > 1 &&
            $id(
              'group_target_' + group_id
            ).lastChild.previousSibling.id.indexOf('group_target') > -1
          ) {            if (task_meta) {              task_meta.parentNode.appendChild(task_meta);
            }
            task_name.parentNode.appendChild(task_name);
            task_bar.parentNode.appendChild(task_bar);
          } else {            if (task_meta) {              task_meta.parentNode.insertBefore(
                task_meta,
                $id('category_meta_target_' + group_id).lastChild
                  .previousSibling
              );
            }
            task_name.parentNode.insertBefore(
              task_name,
              $id('group_target_' + group_id).lastChild.previousSibling
            );
            task_bar.parentNode.insertBefore(
              task_bar,
              $id('group_bar_target_' + group_id).lastChild.previousSibling
            );
          }
        } else {          if (task_meta) {            task_meta.parentNode.insertBefore(
              task_meta,
              $id('category_meta_target_' + group_id).firstChild
            );
          }
          task_name.parentNode.insertBefore(
            task_name,
            $id('group_target_' + group_id).firstChild
          );
          task_bar.parentNode.insertBefore(
            task_bar,
            $id('group_bar_target_' + group_id).firstChild
          );
        }
      }
      check_scroll();
      load_critical_paths();
      if (task['start_date'] != '') {        update_group_bar();
      }
      allow_hover=true;
      unhighlight_all();
      highlight_row('task', task_id, 'hover_on');
      highlight_row('task', task_id, 'moving');
      inline_edit_task($id('task_name_' + task_id), true);
      var scroll_container=$id('scroll_container');
      var resource_view=$id('resource_view');
      var ele=$id('task_name_' + task_id);
      var pos=real_position(ele);
      var task_height=ele.offsetHeight - 3;
      var gantt_scroll_bottom =
        scroll_container.getAttribute('from_top') - resource_view.offsetHeight;
      var task_bottom_y=pos.y + task_height;
      var delta=gantt_scroll_bottom - task_bottom_y;
      var amount_to_scroll=task_height - delta;
      if (amount_to_scroll > 0) {        window.scrollBy(0, amount_to_scroll);
      }
    } else if (_version == 'list_view') {      //DISPLAY TASK
      var t=display_tasks(task);
      _hover_type='task';
      _hover_row=task['task_id'];
      if (type == 'task') {        id='task_' + id;
        var after=$id(id);
        //PLACE IT
        if (after.nextSibling && after.nextSibling != id) {          t.parentNode.insertBefore(t, after.nextSibling);
        } else {          t.parentNode.insertBefore(t, after);
        }
        //FOCUS ON IT
        inline_edit_task_list($id('task_name_span_' + task['task_id']));
      } else if (type == 'group') {        if (_groups[_groups_key[group_id]['group_hidden']] != 0) {          hide_group(group_id, 0);
          save_value('group-hide', group_id, '');
        }
        //PLACE IT
        if (original_id.indexOf('-1') == -1) {          t.parentNode.insertBefore(t, t.parentNode.lastChild.previousSibling);
        } else {          t.parentNode.insertBefore(t, t.parentNode.firstChild);
        }
        //FOCUS ON EDIT
        //$id("task_name_span_"+task['task_id']).focus();
        inline_edit_task_list($id('task_name_span_' + task['task_id']));
      }
    }
    //RETURN QUICK ADDS TO THEIR DEFAULT SETTING
    if ($id('tg_body').className.indexOf('no_tasks') > -1) {      var new_task_count =
        localStorage.getItem('new_task_count') === null
          ? 0
          : localStorage.getItem('new_task_count');
      new_task_count++;
      localStorage.setItem('new_task_count', new_task_count);
      if (new_task_count >= 7) {        $id('tg_body').className=$id('tg_body').className.replace(
          'no_tasks',
          ''
        );
        update_preference({          added_tasks: true,
        });
        localStorage.removeItem('new_task_count');
      }
    }
  }}
function quick_add_group(after_group) {  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var text=ajaxRequest.responseText;
      var t=text.split(',');
      if (text == 'SAVE_ERROR_AUTHENTICATE') {        authenticate_error();
      } else {        if (t.length == 3) {          var g=_groups.length;
          _groups[g]=new Array();
          _groups[g]['group_id']=t[0];
          _groups[g]['project_id']=t[1];
          _groups[g]['parent_group_id']=t[2];
          _groups[g]['group_name']='';
          _groups[g]['group_hidden']=0;
          _groups[g]['min_date']='';
          _groups[g]['max_date']='';
          _groups[g]['duration']=0;
          _groups[g]['total_days']=0;
          _groups[g]['completed_days']=0;
          _groups[g]['editable']=true;
          _groups[g]['visible']=true;
          _groups[g]['indent'] =
            _groups[_groups_key[after_group]]['indent'] * 1;
          _groups[g]['comment_count']='';
          _groups[g]['comment_edit_date']='';
          _groups[g]['user_comment_edit_date']='';
          _groups[g]['document_count']='';
          _groups[g]['document_edit_date']='';
          _groups[g]['user_document_edit_date']='';
          _groups_key[t[0]]=g;
          if (_version == 'gantt_chart') {            var parents=[];
            parents['meta']=$id('category_meta_' + after_group)
              ? $id('category_meta_' + after_group).parentNode
              : null;
            parents['left']=$id('category_title_' + after_group).parentNode;
            parents['right']=$id('category_' + after_group).parentNode;
            var group=display_group(
              _groups[g],
              parents,
              _groups[g]['indent']
            );
            add_quick_add(t[0]);
            //MOVE GROUP UP
            if ($id('group_target_' + after_group).nextSibling) {              if (
                $id('group_target_' + after_group).nextSibling.id !=
                'category_title_' + t[0]
              ) {                //META
                if ($id('meta_data')) {                  group[1].parentNode.insertBefore(
                    group[1],
                    $id('category_meta_target_' + after_group).nextSibling
                  ); // group meta target
                  group[0].parentNode.insertBefore(
                    group[0],
                    $id('category_meta_target_' + after_group).nextSibling
                  ); // group meta
                }
                //LEFT PANEL
                group[3].parentNode.insertBefore(
                  group[3],
                  $id('group_target_' + after_group).nextSibling
                ); // group target
                group[2].parentNode.insertBefore(
                  group[2],
                  $id('group_target_' + after_group).nextSibling
                ); // group name
                //RIGHT PANEL
                group[5].parentNode.insertBefore(
                  group[5],
                  $id('group_bar_target_' + after_group).nextSibling
                ); //group bar target
                group[4].parentNode.insertBefore(
                  group[4],
                  $id('group_bar_target_' + after_group).nextSibling
                ); // group bar
              } else {                //do nothing
              }
            } else {              //DO NOTHING
            }
            allow_hover=true;
            setTimeout(function () {              highlight_row('category', t[0], 'hover_on');
              highlight_row('category', t[0], 'moving');
              inline_edit_group($id('list_group_' + t[0]));
            }, 10);
            finish_load();
          } else if (_version == 'list_view') {            _hover_type='group';
            _hover_row=_groups[g]['group_id'];
            //BUILD
            var group=display_group(_groups[g]);
            //PUT IN THE RIGHT SPOT
            if ($id('category_target_' + after_group).nextSibling) {              group[1].parentNode.insertBefore(
                group[1],
                $id('category_target_' + after_group).nextSibling
              );
              group[0].parentNode.insertBefore(group[0], group[1]);
            }
            //QUICK ADD
            add_quick_add(_groups[g]['group_id']);
            //FOCUS IT
            $id('group_name_span_' + _groups[g]['group_id']).click();
          }
          set_arrows();
          check_scroll();
          load_critical_paths();
          update_group_bar();
        }
      }
    } else {    }
  };
  var queryString='what=quick_add_group&after_group=' + after_group;
  ajaxRequest.open('POST', '../schedule/save.gtm.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
////// EDIT CONTROLS //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// edit window
var _edit_key='';
var _edit_value='';
function edit_task_info(task_id) {  open_iframe_overlay('edit_task', task_id, 'task');
  HashSearch.set('edit', 'task_' + task_id);
}
function edit_project_info(project_id) {  open_iframe_overlay('edit_project', project_id, 'project');
  HashSearch.set('edit', 'project_' + project_id);
}
function edit_group_info(group_id) {  open_iframe_overlay('edit_group', group_id, 'group');
  HashSearch.set('edit', 'group_' + group_id);
}
function edit_overlay_current_user_updated() {  var iframes=document.getElementsByClassName('edit_target_overlay_iframe');
  for (i=0; i < iframes.length; i++) {    var iframe=iframes[i];
    iframe.contentWindow.postMessage(
      JSON.stringify({type: 'current-user-updated'}),
      '*'
    );
  }}
function check_delete_group(group_id, event_name) {  //GET TOTAL NUMBER OF TASKS
  var c=0;
  if (c == 0) {    var group_name=_groups[_groups_key[group_id]]['group_name'];
    var conf_message =
      'Are you sure you want to delete "' +
      group_name.replace(/</g, '&lt;') +
      '"? All tasks inside this group will be permanently deleted.';
    var external_app =
      _projects[_projects_key[_groups[_groups_key[group_id]]['project_id']]][
        'integration_app'
      ];
    if (external_app != '') {      conf_message =
        'Deleting this group will delete the group in ' +
        external_app +
        '. <br /><br /> ' +
        conf_message;
    }
    var conf=custom_confirm(conf_message);
    conf['yes'].onclick=function () {      this.ondblclick();
      start_load('chart');
      save_value('remove_group', group_id, -1);
      if (event_name !== undefined && event_name !== '') {        track_segment_event(event_name);
      }
    };
  } else {    custom_alert(
      'In order to delete a group, you must delete the tasks inside the group first.'
    );
  }}
function edit_window_adjust_task_resources() {  var people=$id('edit_window_assigned_users').value.split(',');
  var company=$id('edit_window_assigned_company').value.split(',');
  var project=$id('edit_window_assigned_project').value.split(',');
  var divs=$id('edit_window_resources').getElementsByTagName('DIV');
  var total_assigned=0;
  for (var d=0; d < divs.length; d++) {    var div=divs[d];
    div.className='hidden';
    if (
      div.getAttribute('resource_type') == 'user' &&
      js_in_array(div.getAttribute('resource_id'), people) > -1
    ) {      div.className='user_resource';
      total_assigned++;
    } else if (
      div.getAttribute('resource_type') == 'company' &&
      js_in_array(div.getAttribute('resource_id'), company) > -1
    ) {      div.className='user_resource other_resource';
      total_assigned++;
    } else if (
      div.getAttribute('resource_type') == 'project' &&
      js_in_array(div.getAttribute('resource_id'), project) > -1
    ) {      div.className='user_resource other_resource';
      total_assigned++;
    }
  }
  var cta=$id('click_to_assign');
  cta.className =
    total_assigned == 0 ? 'user_resource click_to_assign' : 'hidden';
}
function save_task_assigned_hours(task_id, hours) {  if (
    _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
      'project_enable_hours'
    ] == 0 ||
    $id('task_choose_resource_' + task_id)
  ) {    //IF TRIGGERED BY FIX BUTTON IN RESOURCE ASSIGN WINDOW - SKIP POPUP OR HOURS NOT ENABLED ON PROJECT
    save_value('task_estimated_hours', task_id, hours);
  } else {    var auto_pref=$id('auto_hour_scheduling').value;
    var skip_popup=true;
    var task=_tasks[_tasks_key[task_id]];
    var user_resources=task['user_resources'];
    var company_resources=task['company_resources'];
    var custom_resources=task['custom_resources'];
    for (var r in user_resources) {      if (user_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    for (var r in company_resources) {      if (company_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    for (var r in custom_resources) {      if (custom_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    if (skip_popup == true || auto_pref == 'leave_hours') {      save_value('task_estimated_hours', task_id, hours);
    } else if (auto_pref == 'adjust_hours') {      save_value('task_estimated_hours-adjust', task_id, hours);
    } else {      var html =
        'Would you like to automatically adjust the assigned hours for assigned resources as well?<br /><br />';
      if (_version == 'gantt_chart' || _version == 'list_view') {        html += "<div style='font-size:0.9em; max-height:15em;'>";
        var task=_tasks[_tasks_key[task_id]];
        var old_hours=task['estimated_hours'];
        var scale=old_hours > 0 ? hours / old_hours : 1;
        scale=isNaN(scale) ? 1 : scale;
        var total_resources=0;
        for (var i in task['user_resources']) {          total_resources++;
        }
        for (var i in task['company_resources']) {          total_resources++;
        }
        for (var i in task['custom_resources']) {          total_resources++;
        }
        //USER RESOURCES
        for (var i in task['user_resources']) {          var per_day=task['user_resources'][i]['hours_per_day'] * 1;
          var total=task['user_resources'][i]['total_hours'] * 1;
          var new_total=Math.round(total * scale * 100) / 100;
          if (old_hours == 0) {            new_total=Math.round((hours / total_resources) * 100);
            new_total=new_total / 100;
          }
          var resource_name=pull_resource('user', i);
          html +=
            '<div>' +
            resource_name +
            ' would go from <b>' +
            total +
            '</b> to <b>' +
            new_total +
            '</b>.</div>';
        }
        //COMPANY RESOURCES
        for (var i in task['company_resources']) {          var per_day=task['company_resources'][i]['hours_per_day'] * 1;
          var total=task['company_resources'][i]['total_hours'] * 1;
          var new_total=Math.round(total * scale * 100) / 100;
          if (old_hours == 0) {            new_total=Math.round((hours / total_resources) * 100);
            new_total=new_total / 100;
          }
          var resource_name=pull_resource('company', i);
          html +=
            '<div>' +
            resource_name +
            ' would go from <b>' +
            total +
            '</b> to <b>' +
            new_total +
            '</b>.</div>';
        }
        //CUSTOM RESOURCES (project)
        for (var i in task['custom_resources']) {          var per_day=task['custom_resources'][i]['hours_per_day'] * 1;
          var total=task['custom_resources'][i]['total_hours'] * 1;
          var new_total=Math.round(total * scale * 100) / 100;
          if (old_hours == 0) {            new_total=Math.round((hours / total_resources) * 100);
            new_total=new_total / 100;
          }
          var resource_name=pull_resource('custom', i);
          html +=
            '<div>' +
            resource_name +
            ' would go from <b>' +
            total +
            '</b> to <b>' +
            new_total +
            '</b>.</div>';
        }
        html += '</div>';
      }
      hours_confirm_popup(
        html,
        function () {          save_value('task_estimated_hours-adjust', task_id, hours);
        },
        function () {          save_value('task_estimated_hours', task_id, hours);
        }
      );
    }
  }}
function hours_conf_popup_text(task_id, force_dates) {  var ele=$id('task_div_' + task_id);
  if (ele) {    var dates=force_dates || find_date(ele, find_day_width());
    var holidays=find_holidays(_tasks[_tasks_key[task_id]]['project_id']);
    var new_days=day_diff(
      dates[0],
      dates[1],
      _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
        'chart_days'
      ],
      holidays,
      true
    );
    var task=_tasks[_tasks_key[task_id]];
    var cur_days =
      task['weeks'] *
        _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
          'chart_days'
        ].length *
        1 +
      task['days'] * 1;
    var cur_hours=task['estimated_hours'];
    var per_day_hours=Math.round((cur_hours / cur_days) * 100) * 0.01;
    var new_total_hours=Math.round(new_days * per_day_hours * 100) / 100;
    var increase_decrease=cur_days < new_days ? 'increase' : 'decrease';
    var html =
      'Would you also like to <b>' +
      increase_decrease +
      ' the number of total hours assigned</b> to each person/label on this task.<br /><br />';
    html += "<div style='font-size:0.9em; max-height:15em;'>";
    //USER RESOURCES
    for (var i in task['user_resources']) {      var per_day=task['user_resources'][i]['hours_per_day'] * 1;
      var total=task['user_resources'][i]['total_hours'] * 1;
      var new_total=Math.round(per_day * new_days * 100) / 100;
      var resource_name=pull_resource('user', i);
      html +=
        '<div>' +
        resource_name +
        ' would go from <b>' +
        total +
        '</b> to <b>' +
        new_total +
        '</b>.</div>';
    }
    //COMPANY RESOURCES
    for (var i in task['company_resources']) {      var per_day=task['company_resources'][i]['hours_per_day'] * 1;
      var total=task['company_resources'][i]['total_hours'] * 1;
      var new_total=Math.round(per_day * new_days * 100) / 100;
      var resource_name=pull_resource('company', i);
      html +=
        '<div>' +
        resource_name +
        ' would go from <b>' +
        total +
        '</b> to <b>' +
        new_total +
        '</b>.</div>';
    }
    //CUSTOM RESOURCES (project)
    for (var i in task['custom_resources']) {      var per_day=task['custom_resources'][i]['hours_per_day'] * 1;
      var total=task['custom_resources'][i]['total_hours'] * 1;
      var new_total=Math.round(per_day * new_days * 100) / 100;
      var resource_name=pull_resource('custom', i);
      html +=
        '<div>' +
        resource_name +
        ' would go from <b>' +
        total +
        '</b> to <b>' +
        new_total +
        '</b>.</div>';
    }
    html += '</div>';
  } else {    var html =
      'You have changed the duration of this task. Would you like to automatically adjust the estimated and assigned hours as well?';
  }
  return html;
}
function hours_confirm_popup(html, handle_adjust_hours, handle_leave_hours) {  var conf=custom_confirm(html);
  conf['yes'].onclick=function () {    handle_adjust_hours();
    if (
      $id('auto_hours_remember') &&
      $id('auto_hours_remember').checked == true
    ) {      $id('auto_hour_scheduling').value='adjust_hours';
      $id('auto_hour_scheduling').onchange();
    }
    this.ondblclick();
  };
  conf['no'].onclick=function () {    handle_leave_hours();
    if (
      $id('auto_hours_remember') &&
      $id('auto_hours_remember').checked == true
    ) {      $id('auto_hour_scheduling').value='leave_hours';
      $id('auto_hour_scheduling').onchange();
    }
    this.ondblclick();
  };
  //UPDATE BUTTON TEXT
  conf['yes'].firstChild.nodeValue='Yes, adjust hours.';
  conf['no'].firstChild.nodeValue='No, leave hours';
  //REMEMBER PREFERENCE
  if (_version == 'gantt_chart' || _version == 'list_view') {    var parent=conf['yes'].parentNode.parentNode;
    var remember_div=$create('DIV');
    var remember_label=$create('LABEL');
    var remember=$create('INPUT');
    remember.type='checkbox';
    remember.id='auto_hours_remember';
    remember_label.appendChild(remember);
    remember_label.appendChild($text(' remember setting'));
    remember_div.appendChild(remember_label);
    parent.appendChild(remember_div);
  }}
function task_date_hours_adjust(task_id, save_key, save_value, close_edit) {  close_edit=close_edit || false;
  if (
    _projects[_projects_key[_tasks[_tasks_key[task_id]]['project_id']]][
      'project_enable_hours'
    ] == 1 &&
    _tasks[_tasks_key[task_id]]['estimated_hours'] != 0
  ) {    var auto_pref=$id('auto_hour_scheduling').value;
    var skip_popup=true;
    var task=_tasks[_tasks_key[task_id]];
    var user_resources=task['user_resources'];
    var company_resources=task['company_resources'];
    var custom_resources=task['custom_resources'];
    for (var r in user_resources) {      if (user_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    for (var r in company_resources) {      if (company_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    for (var r in custom_resources) {      if (custom_resources[r]['resource_id'] != '') {        skip_popup=false;
      }
    }
    if (skip_popup == true || auto_pref == 'leave_hours') {      update_changes('task', task_id, save_key, save_value, close_edit);
    } else if (auto_pref == 'adjust_hours') {      update_changes(
        'task',
        task_id,
        save_key + '-hours',
        save_value,
        close_edit
      );
    } else {      var start_date =
        save_key.indexOf('start') > -1
          ? save_value
          : _tasks[_tasks_key[task_id]]['start_date'];
      var end_date =
        save_key.indexOf('end') > -1
          ? save_value
          : _tasks[_tasks_key[task_id]]['end_date'];
      var force_dates=[start_date, end_date];
      var html=hours_conf_popup_text(task_id, force_dates);
      hours_confirm_popup(
        html,
        function () {          update_changes(
            'task',
            task_id,
            save_key + '-hours',
            save_value,
            close_edit
          );
        },
        function () {          update_changes('task', task_id, save_key, save_value, close_edit);
        }
      );
    }
  } else {    update_changes('task', task_id, save_key, save_value, close_edit);
  }}
var _colors=[
  'blue2',
  'green1',
  'purple1',
  'red1',
  'orange1',
  'blue1',
  'grey1',
  'yellow1',
  'blue3',
  'magenta1',
  'pink1',
  'green2',
  'purple2',
  'orange2',
  'brown1',
  'green3',
];
function open_color_checker(type, type_id) {  var div=$create('DIV');
  div.className='task_color_dd';
  div.setAttribute('type', type);
  div.setAttribute('type_id', type_id);
  div.setAttribute('mouse_over', 1);
  div.setAttribute('target', type + '_div_' + type_id);
  div.id=type + '_choose_color_' + type_id;
  var per_row=4;
  var cur_color =
    type == 'task' ? _tasks[_tasks_key[type_id]]['color'] : 'blue2';
  for (var i=0; i < _colors.length; i++) {    var color_parent=$create('DIV');
    color_parent.className='pick_color ' + _colors[i];
    if (i % per_row == 0) {      color_parent.className += ' clear';
    }
    color_parent.setAttribute('color', _colors[i]);
    color_parent.setAttribute('type', type);
    color_parent.setAttribute('type_id', type_id);
    color_parent.onclick=function () {      set_task_color(
        this.getAttribute('type'),
        this.getAttribute('type_id'),
        this.getAttribute('color')
      );
      highlight_color(this);
      if (this.getAttribute('type') == 'group') {        var parent=$id('group_bar_target_' + type_id);
        if (parent) {          var divs=parent.getElementsByTagName('DIV');
          for (var d=0; d < divs.length; d++) {            if (divs[d].className.indexOf('task_in_chart') != -1) {              update_task_color(
                divs[d].getAttribute('task_id'),
                this.getAttribute('color')
              );
            }
          }
        }
        track_segment_event('gantt-changed-group-color-from-gantt-icon');
      } else {        update_task_color(
          this.getAttribute('type_id'),
          this.getAttribute('color')
        );
        track_segment_event('gantt-changed-task-color-from-gantt-icon');
      }
      if (
        this.getAttribute('type') == 'task' &&
        _multi_select != null &&
        _multi_select.element_ids.length > 1
      ) {        for (i=0; i < _multi_select.element_ids.length; i++) {          var task_id=_multi_select.element_ids[i];
          if (task_id != this.getAttribute('type_id')) {            set_task_color('task', task_id, this.getAttribute('color'));
            update_task_color(task_id, this.getAttribute('color'));
          }
        }
      }
      if ($id('edit_window')) {        $id('edit_window_header').className=this.getAttribute('color');
        $id('edit_window_header_percent_complete').className =
          this.getAttribute('color');
        $id('task_color_bar').className =
          $id('task_color_bar').getAttribute('default_class') +
          this.getAttribute('color');
        this.parentNode.parentNode.removeChild(this.parentNode);
      } else {        if (typeof clear_utility_box == 'function') {          clear_utility_box();
        }
        hide_backdrop();
      }
      if (this.parentNode.getAttribute('auto_close') == 'true') {        this.parentNode.parentNode.removeChild(this.parentNode);
      }
    };
    var color=$create('DIV');
    color.className='color_option';
    color.className += _colors[i] == cur_color ? ' selected' : '';
    color_parent.appendChild(color);
    div.appendChild(color_parent);
  }
  var clear=$create('DIV');
  clear.className='clear';
  div.appendChild(clear);
  clear_text();
  return div;
}
function load_possible_groups() {  var arr=[];
  var project_order=[];
  var group_order=[];
  if (_version == 'gantt_chart') {    var parent=$id('inner_list_wrapper');
    var divs=parent.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      var div=divs[d];
      if (div.id.indexOf('project_title_') > -1) {        var project_id=div.getAttribute('project_id');
        var len=project_order.length;
        project_order[len]=project_id;
      } else if (div.id.indexOf('category_title_') > -1) {        var group_id=div.getAttribute('group_id');
        var len=group_order.length;
        group_order[len]=[];
        group_order[len]['project_id'] =
          project_order[project_order.length - 1];
        group_order[len]['group_id']=group_id;
      }
    }
  } else if (_version == 'list_view') {    var parent=$id('list_view');
    var divs=parent.getElementsByTagName('DIV');
    for (var d=0; d < divs.length; d++) {      var div=divs[d];
      if (div.id.indexOf('project_title_') > -1) {        var project_id=div.getAttribute('project_id');
        var len=project_order.length;
        project_order[len]=project_id;
      } else if (div.id.indexOf('group_name_') > -1) {        var group_id=div.getAttribute('group_id');
        var len=group_order.length;
        group_order[len]=[];
        group_order[len]['project_id'] =
          project_order[project_order.length - 1];
        group_order[len]['group_id']=group_id;
      }
    }
  } else if (_version == 'calendar') {    //PROJECTS
    var project_order=[_projects[0]['project_id']];
    //GROUPS
    for (var g=0; g < _groups.length; g++) {      var len=group_order.length;
      group_order[len]=[];
      group_order[len]['project_id']=_groups[g]['project_id'];
      group_order[len]['group_id']=_groups[g]['group_id'];
    }
  }
  for (var p=0; p < project_order.length; p++) {    var permission =
      _projects[_projects_key[project_order[p]]]['project_permission'];
    var project_name =
      _projects[_projects_key[project_order[p]]]['project_name'];
    var disabled=_projects[_projects_key[project_order[p]]]['disabled'];
    //make sure they have the right permission to the project
    if (disabled == 0 && (permission == 'admin' || permission == 'edit')) {      //get the groups now
      for (g=0; g < group_order.length; g++) {        if (group_order[g]['project_id'] == project_order[p]) {          var group=_groups[_groups_key[group_order[g]['group_id']]];
          var text=project_name + ' - ' + group['group_name'];
          var group_name='';
          for (var hash=0; hash < group['indent']; hash++) {            group_name += '- ';
          }
          group_name += group['group_name'];
          var cur_len=arr.length;
          arr[cur_len]=[
            group['group_id'],
            text,
            project_name,
            group_name,
            project_order[p],
          ];
        }
      }
    }
  }
  return arr;
}
function edit_window_resources() {  var badge_dd=display_badge_dd(
    'resources',
    'task',
    $id('task_edit_id').value,
    null,
    true
  );
  badge_dd.id='edit_window_edit_resources';
  document.body.appendChild(badge_dd);
  badge_dd.getElementsByTagName('INPUT')[0].focus();
  badge_dd.getElementsByTagName('INPUT')[0].onkeyup(null);
}
function update_changes(target, target_id, what, value, close_edit_window) {  close_edit_window=close_edit_window || false;
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState != 4) {    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var text=ajaxRequest.responseText;
      if (text == 'SAVE_ERROR_AUTHENTICATE') {        authenticate_error();
      } else {        if (
          what == 'task_start_date' ||
          what == 'task_start_date-hours' ||
          what == 'task_end_date' ||
          what == 'task_end_date-hours' ||
          what == 'task_weeks' ||
          what == 'task_weeks-hours' ||
          what == 'task_days' ||
          what == 'task_days-hours'
        ) {          var xml=ajaxRequest.responseXML;
          var tasks=xml
            .getElementsByTagName('TASKS')[0]
            .getElementsByTagName('TASK');
          for (var t=0; t < tasks.length; t++) {            var task_id=getNodeValue(tasks[t], 'ID');
            var new_start_date=getNodeValue(tasks[t], 'START_DATE');
            var new_end_date=getNodeValue(tasks[t], 'END_DATE');
            var weeks=getNodeValue(tasks[t], 'WEEKS');
            var days=getNodeValue(tasks[t], 'DAYS');
            var total_days=getNodeValue(tasks[t], 'TOTAL_DAYS');
            var estimated_hours=getNodeValue(tasks[t], 'ESTIMATED_HOURS') * 1;
            var assigned_hours=0;
            if (_tasks[_tasks_key[task_id]]) {              _tasks[_tasks_key[task_id]]['start_date']=new_start_date;
              _tasks[_tasks_key[task_id]]['end_date']=new_end_date;
              _tasks[_tasks_key[task_id]]['weeks']=weeks;
              _tasks[_tasks_key[task_id]]['days']=days;
              _tasks[_tasks_key[task_id]]['total_days']=total_days;
              _tasks[_tasks_key[task_id]]['completed_days'] =
                (total_days / _tasks[_tasks_key[task_id]]['percent_complete']) *
                100;
              _tasks[_tasks_key[task_id]]['estimated_hours']=estimated_hours;
              if ($id('task_estimated_hours_' + task_id)) {                var div=$id('task_estimated_hours_' + task_id);
                remove_child_nodes(div);
                div.appendChild($text(estimated_hours));
              }
              var resources=tasks[t]
                .getElementsByTagName('RESOURCES')[0]
                .getElementsByTagName('RESOURCE');
              for (var r=0; r < resources.length; r++) {                var resource_type=getNodeValue(resources[r], 'RESOURCE_TYPE');
                var resource_id=getNodeValue(resources[r], 'RESOURCE_ID');
                var hours_per_day=getNodeValue(resources[r], 'HOURS_PER_DAY');
                var total_hours=getNodeValue(resources[r], 'TOTAL_HOURS');
                assigned_hours += total_hours * 1;
                if (
                  _tasks[_tasks_key[task_id]][resource_type + '_resources'][
                    resource_id
                  ]
                ) {                  _tasks[_tasks_key[task_id]][resource_type + '_resources'][
                    resource_id
                  ]['hours_per_day']=hours_per_day;
                  _tasks[_tasks_key[task_id]][resource_type + '_resources'][
                    resource_id
                  ]['total_hours']=total_hours;
                }
              }
              _tasks[_tasks_key[task_id]]['assigned_hours']=assigned_hours;
            }
          }
          if (
            $id('edit_window') &&
            $id('edit_window').getAttribute('target') == 'task' &&
            $id('edit_window').getAttribute('target_id') == task_id
          ) {            $id('task_start_date').value=new_start_date;
            $id('task_end_date').value=new_end_date;
            $id('task_weeks').firstChild.nodeValue=weeks;
            $id('task_days').firstChild.nodeValue=days;
            if ($id('task_estimated_hours')) {              $id('task_estimated_hours').firstChild.nodeValue =
                estimated_hours;
            }
          }
          //START AND END PRETTY DATES
          var the_start_date=pretty_date(new_start_date);
          var the_end_date=pretty_date(new_end_date);
          if (_version == 'list_view') {            //UPDATE DATES
            var start_date=$id('start_date_column_' + target_id);
            //remove_child_nodes(start_date);
            start_date.setAttribute('allow_date', 1);
            start_date.firstChild.nodeValue=the_start_date;
            var end_date=$id('end_date_column_' + target_id);
            //remove_child_nodes(end_date);
            end_date.setAttribute('allow_date', 1);
            end_date.firstChild.nodeValue=the_end_date;
            //TASK PROGESS BAR
            var bar=$id('task_line_' + target_id);
            var percent_line=task_today_line(target_id);
            bar.style.marginLeft=percent_line + '%';
            bar.style.left=percent_line == 100 ? '1px' : 0;
            //PERCENT COMPLETE
            var percent_complete=$id('task_percent_complete_' + target_id);
            //DUE DATE COLOR
            end_date.className=trim(end_date.className.replace(/today/g, ''));
            if (percent_line == 100) {              end_date.className += ' today';
            }
            if (the_start_date == '' || the_end_date == '') {              //percent_complete.className += " visible_hidden";
              bar.className += ' visible_hidden';
              start_date.className += ' not_set';
              end_date.className += ' not_set';
              start_date.firstChild.nodeValue='set date';
              end_date.firstChild.nodeValue='set date';
            } else {              //percent_complete.className=trim(percent_complete.className.replace(/visible_hidden/g,""));
              bar.className=trim(
                bar.className.replace(/visible_hidden/g, '')
              );
              start_date.className=trim(
                start_date.className.replace(/not_set/g, '')
              );
              end_date.className=trim(
                end_date.className.replace(/not_set/g, '')
              );
            }
          }
          //UPDATE EDIT WINDOW
          if (
            $id('edit_window') &&
            $id('edit_window').getAttribute('target') == 'task' &&
            $id('edit_window').getAttribute('target_id') == task_id
          ) {            $id('task_start_date_text').firstChild.nodeValue=the_start_date;
            $id('task_start_date').value=new_start_date;
            $id('task_end_date_text').firstChild.nodeValue=the_end_date;
            $id('task_end_date').value=new_end_date;
            if ($id('task_estimated_hours')) {              $id('task_estimated_hours').value=estimated_hours;
            }
          }
        } else if (what == 'project_status' && text != '') {          $id('project_status').value='Complete';
          custom_alert(text);
        }
        if (close_edit_window == true || close_edit_window == 'true') {          close_iframe_overlay();
        }
      }
    } else {    }
  };
  var queryString='target=' + target;
  queryString += '&target_id=' + target_id;
  queryString += '&what=' + what;
  if (
    what == 'task_weeks' ||
    what == 'task_weeks-hours' ||
    what == 'task_days' ||
    what == 'task_days-hours'
  ) {    queryString +=
      '&value=' +
      make_numeric($id('task_weeks').firstChild.nodeValue) +
      ':' +
      make_numeric($id('task_days').firstChild.nodeValue);
  } else if (what == 'project_days') {    var val='';
    for (var i=0; i < 7; i++) {      if ($id('day_of_week_' + i).checked == true) {        val += val == '' ? i : ',' + i;
      }
    }
    queryString += '&value=' + tweak_text_for_get(val);
  } else {    queryString += '&value=' + tweak_text_for_get(value);
  }
  ajaxRequest.open('POST', '../schedule/save.edit_window.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function has_paid_plans(projects) {  for (var i=0; i < projects.length; i++) {    if (projects[i].company_plan.toLowerCase() !== 'free') {      return true;
    }
  }
  return false;
}
function trigger_free_plan_embed_warning() {  var company_permission=_projects[0]['company_permission'];
  if (company_permission === 'admin') {    var upgrade_message =
      'Sorry, external plan sharing via link or embed is not available in your free plan. Upgrade your plan to Standard to start using public sharing.';
    var alert=newAppAlert(upgrade_message, null, 'Upgrade Plan');
    alert.button.setAttribute('company_id', _projects[0]['company_id']);
    alert.button.onclick=function () {      window.location =
        NEW_APP_URL +
        'admin/companies/' +
        this.getAttribute('company_id') +
        '/subscription';
    };
    return;
  }
  var upgrade_message =
    'Sorry, external plan sharing via link or embed is not available in your free plan. Contact an account holder and request an upgrade to the Standard plan.';
  var alert=newAppAlert(
    upgrade_message,
    null,
    "I'll contact an account holder"
  );
  alert.button.onclick=function () {    var overlay=$id('custom_alert_cover');
    overlay.click(); // clicking the overlay closes the overlay
  };
}
function open_embed_window() {  close_previous_dds();
  if (!has_paid_plans(_projects)) {    trigger_free_plan_embed_warning();
    return;
  }
  if ($id('edit_window')) {    $id('edit_window').parentNode.removeChild($id('edit_window'));
  }
  if (_multi_select_default) {    _multi_select.clear(true);
    _multi_select.done();
  }
  var background=build_background_cover();
  background.id='edit_window_background';
  background.className += ' full_width';
  background.onclick=function () {    hide_backdrop();
    load_gantt();
    if ($id('edit_window_background')) {      $id('edit_window_background').parentNode.removeChild(
        $id('edit_window_background')
      );
    }
    allow_hover=true;
    unhighlight_all();
  };
  var div=$create('DIV');
  div.id='edit_window';
  div.setAttribute('target', 'embed');
  div.setAttribute('target_id', 0);
  div.className='project';
  document.body.appendChild(div);
  //HEADER
  var header=$create('DIV');
  header.id='edit_window_header';
  header.className='blue2';
  div.appendChild(header);
  var percent_complete=100;
  //PERCENT COMPLETE BACKGROUND
  var header_percent_complete=$create('DIV');
  header_percent_complete.id='edit_window_header_percent_complete';
  header_percent_complete.className='blue2';
  header_percent_complete.style.width=percent_complete + '%';
  header.appendChild(header_percent_complete);
  //HEADER WRAPPER
  var header_wrapper=$create('DIV');
  header_wrapper.id='edit_window_header_wrapper';
  header.appendChild(header_wrapper);
  //EMBED
  var title_name=$create('DIV');
  title_name.id='edit_window_group_name';
  title_name.appendChild($text('Build Embed Code'));
  title_name.style.color='#fff';
  title_name.style.fontSize='2em';
  title_name.style.fontWeight='bold';
  title_name.style.marginTop='0.5em';
  header_wrapper.appendChild(title_name);
  //MAIN BODY
  var main_body=$create('DIV');
  main_body.id='edit_window_body';
  main_body.style.paddingTop='1.5em';
  div.appendChild(main_body);
  //PROJECT SELECTION
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Select Projects:'));
  main_body.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  main_body.appendChild(value);
  var project_selection=$create('DIV');
  project_selection.id='public_key_projects';
  value.appendChild(project_selection);
  build_project_selection();
  //COLUMNS
  var left_side=$create('DIV');
  left_side.setAttribute(
    'style',
    'clear: both; float: left; width:40%; padding-top:0.5em;'
  );
  main_body.appendChild(left_side);
  var right_side=$create('DIV');
  right_side.setAttribute('style', 'float:left; width:50%; padding-top:0.5em;');
  main_body.appendChild(right_side);
  //HEADING
  var heading=$create('H2');
  heading.appendChild($text('Size & Positioning:'));
  left_side.appendChild(heading);
  //WIDTH
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Width:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var input=$create('INPUT');
  input.id='public_width';
  input.type='text';
  input.value='100%';
  input.size=5;
  input.onchange=function () {    build_public_code();
  };
  value.appendChild(input);
  //HEIGHT
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Height:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var input=$create('INPUT');
  input.id='public_height';
  input.type='text';
  input.value='800px';
  input.size=5;
  input.onchange=function () {    build_public_code();
  };
  value.appendChild(input);
  //POSITION
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Position:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_position';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['left', 'Left'],
    ['center', 'Center', 'selected'],
    ['right', 'Right'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //ZOOM
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Zoom:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_zoom';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['d120', 'Day 120%'],
    ['d110', 'Day 110%'],
    ['d100', 'Day 100%'],
    ['d100', 'Day 100%', 'selected'],
    ['d90', 'Day 90%'],
    ['d80', 'Day 80%'],
    ['w120', 'Week 120%'],
    ['w110', 'Week 110%'],
    ['w100', 'Week 100%'],
    ['w90', 'Week 90%'],
    ['w80', 'Week 80%'],
    ['w70', 'Week 70%'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //FONT SIZE
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Font Size:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_font_size';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['9', '9'],
    ['10', '10'],
    ['11', '11'],
    ['12', '12', 'selected'],
    ['13', '13'],
    ['14', '14'],
    ['15', '15'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //TASK WIDTH
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Task Column Width:'));
  left_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  left_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_col_width';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['255', 'Smaller'],
    ['355', 'Default', 'selected'],
    ['455', 'Larger'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //HEADING
  var heading=$create('H2');
  heading.appendChild($text('Choose which to display:'));
  right_side.appendChild(heading);
  //DOCUMENTS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Documents:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_documents';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Column', 'selected'],
    ['1', 'Display Column'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //COMMENTS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Comments:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_comments';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Column', 'selected'],
    ['1', 'Display Column'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //ESTIMATED HOURS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Estimated Hours:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_estimated_hours';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Column', 'selected'],
    ['1', 'Display Column'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //ASSIGNED RESOURCES
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Resources:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_assigned_resources';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Column', 'selected'],
    ['1', 'Display Column'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //PERCENT COMPLETE
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Percent Complete:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_percent_complete';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Column', 'selected'],
    ['1', 'Display Column'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //PERCENT COMPLETE
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Apply Filters:'));
  right_side.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  right_side.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_apply_filters';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['false', 'No'],
    ['true', 'Yes', 'selected'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //ADVANCED
  var more=$create('DIV');
  more.className='clear key more';
  more.appendChild($text('More...'));
  more.onclick=function () {    this.nextSibling.className='';
    this.className='hidden';
  };
  right_side.appendChild(more);
  var advanced=$create('DIV');
  advanced.className='hidden';
  right_side.appendChild(advanced);
  //HIDE HEADER TABS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Header Tabs:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_hide_header_tabs';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Allow switching between Gantt, List, and Calendar'],
    ['1', 'Deny switching between Gantt, List, and Calendar'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //MENU & VIEW CONTROLS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Menu & View:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_show_menu_view';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Menu & View Controls'],
    ['1', 'Display Menu & View Controls', 'selected'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //RESOURCE FILTER CONTROLS
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Resource Filter:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_show_resource_filter';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Hide Resource Filter'],
    ['1', 'Display Resource Filter', 'selected'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //TASK NAME IN/NEXT BAR
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Task Name:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_task_name_in_bar';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Do not show in chart', 'selected'],
    ['1', 'Show in Task Bar'],
    ['2', 'Show Next to Task Bar'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //RESOURCE NAMES
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Resources:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_task_resource_names';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Do NOT Show on Chart'],
    ['1', 'Show on Chart', 'selected'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  //RESOURCE HOURS PER DAY
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('Resources Hours:'));
  advanced.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  advanced.appendChild(value);
  var sel=$create('SELECT');
  sel.id='public_task_resource_hours_per_day';
  sel.onchange=function () {    build_public_code();
  };
  value.appendChild(sel);
  var opts=[
    ['0', 'Do NOT Show on Chart'],
    ['1', 'Show on Chart', 'selected'],
  ];
  for (var o=0; o < opts.length; o++) {    var option=$create('OPTION');
    option.value=opts[o][0];
    option.appendChild($text(opts[o][1]));
    if (opts[o][2]) {      option.setAttribute('selected', 'selected');
    }
    sel.appendChild(option);
  }
  var codes=$create('DIV');
  codes.id='embed_codes';
  codes.style.clear='both';
  codes.style.paddingTop='2em';
  main_body.appendChild(codes);
  var heading=$create('H2');
  heading.appendChild($text('Get Codes:'));
  codes.appendChild(heading);
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('IFrame:'));
  codes.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  codes.appendChild(value);
  var iframe=$create('TEXTAREA');
  iframe.id='public_iframe';
  iframe.rows=10;
  iframe.cols=100;
  iframe.style.width='550px';
  iframe.value='Select at least one project above.';
  iframe.onmouseup=function () {    this.select();
  };
  value.appendChild(iframe);
  var key=$create('DIV');
  key.className='key';
  key.appendChild($text('URL:'));
  codes.appendChild(key);
  var value=$create('DIV');
  value.className='value';
  codes.appendChild(value);
  var url_link=$create('TEXTAREA');
  url_link.id='public_link2';
  url_link.rows=3;
  url_link.cols=100;
  url_link.style.width='550px';
  url_link.value='Select at least one project above.';
  url_link.onmouseup=function () {    this.select();
  };
  value.appendChild(url_link);
  //IF PROJECTS ARE PRECHECKED - BUILD CODE NOW
  build_public_code();
}
function footer_call_embed() {  open_embed_window();
  var inputs=$id('public_key_projects').getElementsByTagName('INPUT');
  for (var i=0; i < inputs.length; i++) {    if (inputs[i].type == 'checkbox' && inputs[i].checked == false) {      inputs[i].click();
    }
  }
  build_public_code();
  var code=$id('public_link2').value;
  if ($id('edit_window')) {    $id('edit_window').parentNode.removeChild($id('edit_window'));
    remove_background_cover('edit_window_background');
  }
  var text =
    '<b>Below is a link that you can copy and paste to send out to others.  This will be a read only view of your project.</b> <br /><br />';
  text +=
    'To get all the benefits of TeamGantt, instead of just sending out a link, we recommend that you ';
  text +=
    "<u onclick=\"$id('custom_alert_yes').click(); $id('header_load_resources').click();\" class='fake_link'>invite people</u> ";
  text += 'to the project so that ';
  text +=
    'they can log in, view their tasks, get email notifications of changes, share files, have discussions and get the full benefits of ';
  text +=
    'collaboration with TeamGantt.  However, if you just want to send out a link for someone to view your project, copying the link below ';
  text +=
    'is a good way to achieve this.  It will always pull the most recent changes so that people can click this link at anytime to get the most up to date schedule.';
  var html =
    "<textarea style='margin-top:1em; width:100%; height:5.5em; font-size:1em;'>" +
    code +
    '</textarea>';
  html +=
    "<div>to customize the embed format, please <a onclick='$id(\"custom_alert_yes\").click(); open_embed_window();' class='fake_link'>click here</a></div>";
  var div=custom_alert('<div>' + text + '</div>\n' + html);
  div.id='custom_alert_yes';
  div.onclick=function () {    if ($id('edit_window_background')) {      $id('edit_window_background').parentNode.removeChild(
        $id('edit_window_background')
      );
    }
    this.ondblclick();
  };
  div.parentNode.style.width='750px';
  open_footer_share('close');
}
function build_project_selection() {  var target=$id('public_key_projects');
  remove_child_nodes(target);
  var table=$create('TABLE');
  table.className='edit_table edit_table_border';
  table.setAttribute('cellpadding', 0);
  table.setAttribute('cellspacing', 0);
  table.width='100%';
  var header=table.insertRow(0);
  header.className='header_row';
  var cell=header.insertCell(0);
  cell.appendChild($text(' '));
  var cell=header.insertCell(1);
  cell.appendChild($text('Project Name'));
  cell.setAttribute('width', '40%');
  var cell=header.insertCell(2);
  cell.appendChild($text('Public Key'));
  for (var i=0; i < _projects.length; i++) {    if (_projects[i]['company_plan'].toLowerCase() === 'free') {      continue;
    }
    var rows=table.rows.length;
    var row=table.insertRow(rows);
    var cell=row.insertCell(0);
    cell.setAttribute('width', 20);
    var input=$create('INPUT');
    input.type='checkbox';
    input.value=_projects[i]['project_id'];
    var do_disable =
      _projects[i]['disabled'] == 0 &&
      (_projects[i]['public_key'] == '' ||
        _projects[i]['project_permission'] != 'admin')
        ? 1
        : 0;
    input.setAttribute('is_disabled', do_disable);
    input.setAttribute('project_id', _projects[i]['project_id']);
    input.onclick=function () {      if (this.checked && this.getAttribute('is_disabled') == 1) {        if (
          _projects[_projects_key[this.getAttribute('project_id')]][
            'project_permission'
          ] == 'admin'
        ) {          if (
            _projects[_projects_key[this.getAttribute('project_id')]][
              'public_key'
            ] == ''
          ) {            var r_string=random_string(12);
            var body={              public_key: r_string,
            };
            var callback=function () {};
            update_target(
              'project',
              this.getAttribute('project_id'),
              body,
              callback
            );
            _projects[_projects_key[this.getAttribute('project_id')]][
              'public_key'
            ]=r_string;
            this.disabled=false;
            this.checked=true;
            this.setAttribute('is_disabled', 0);
            $id(
              'project_public_key_' + this.getAttribute('project_id')
            ).firstChild.nodeValue=r_string;
          }
        } else {          var message =
            'This project has not been made public by the project administrator. ';
          message +=
            "Ask the project administrator to make the project public by assigning a <b>'Public Key'</b> under <b>Menu > Project Settings</b>";
          custom_alert(message);
          this.checked=false;
        }
      }
      build_public_code();
    };
    if (_projects[i]['public_key'] != '') {      input.checked=true;
    }
    cell.appendChild(input);
    var cell=row.insertCell(1);
    cell.classList.add('project_name');
    cell.title=_projects[i]['project_name'];
    cell.appendChild($text(_projects[i]['project_name']));
    var cell=row.insertCell(2);
    cell.id='project_public_key_' + _projects[i]['project_id'];
    var key=_projects[i]['public_key'];
    if (
      _projects[i]['disabled'] == 1 ||
      _projects[i]['project_permission'] != 'admin'
    ) {      cell.appendChild(
        $text('You must be a project admin to create an embed code.')
      );
    } else if (key == '') {      cell.appendChild($text('...'));
    } else {      cell.appendChild($text(_projects[i]['public_key']));
    }
  }
  target.appendChild(table);
}
function random_string(lngth) {  var text='';
  var possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i=0; i < lngth; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
function build_public_code() {  var projects=[];
  var keys=[];
  var selected_projects_inputs=$id(
    'public_key_projects'
  ).getElementsByTagName('INPUT');
  for (var i=0; i < selected_projects_inputs.length; i++) {    if (selected_projects_inputs[i].checked == true) {      var len=projects.length;
      var id=selected_projects_inputs[i].value;
      projects[len]=id;
      keys[len] =
        _projects[_projects_key[id]]['public_key'] != ''
          ? _projects[_projects_key[id]]['public_key']
          : 'LOGIN';
    }
  }
  var width=$id('public_width').value;
  var height=$id('public_height').value;
  var position=$id('public_position').value;
  var zoom=$id('public_zoom').value;
  var font_size=$id('public_font_size').value;
  var estimated_hours=$id('public_estimated_hours').value;
  var assigned_resources=$id('public_assigned_resources').value;
  var percent_complete=$id('public_percent_complete').value;
  var documents=$id('public_documents').value;
  var comments=$id('public_comments').value;
  var col_width=$id('public_col_width').value;
  var public_hide_header_tabs=$id('public_hide_header_tabs').value;
  var public_show_menu_view=$id('public_show_menu_view').value;
  var public_show_resource_filter=$id('public_show_resource_filter').value;
  var public_task_name_in_bar=$id('public_task_name_in_bar').value;
  var public_task_resource_names=$id('public_task_resource_names').value;
  var public_task_resource_hours_per_day=$id(
    'public_task_resource_hours_per_day'
  ).value;
  var apply_filters=$id('public_apply_filters').value;
  //FOR IFRAME
  var frame=$id('public_iframe');
  var tg=tgframe_clean({    id: projects,
    key: keys,
    width: width,
    height: height,
    position: position,
    zoom: zoom,
    font_size: font_size,
    estimated_hours: estimated_hours,
    assigned_resources: assigned_resources,
    percent_complete: percent_complete,
    documents: documents,
    comments: comments,
    col_width: col_width,
    public_hide_header_tabs: public_hide_header_tabs,
    public_show_menu_view: public_show_menu_view,
    public_task_name_in_bar: public_task_name_in_bar,
    public_task_resource_names: public_task_resource_names,
    public_show_resource_filter: public_show_resource_filter,
    public_task_resource_hours_per_day: public_task_resource_hours_per_day,
    apply_filters: apply_filters,
  });
  //div style
  var div_style='';
  div_style += 'width:' + tg.width + '; ';
  if (position == 'left') {    div_style += 'margin:0 auto 0 0; ';
  } else if (position == 'center') {    div_style += 'margin:0 auto; ';
  } else if (position == 'right') {    div_style += 'margin:0 0 0 auto; ';
  }
  div_style += 'background:#eeeeee; border:1px #cbcbcb solid;';
  var a_style='';
  a_style += 'display:block; text-align:right; ';
  a_style +=
    'background:url(https://prod.teamgantt.com/images/powered_by_teamgantt.png) right center no-repeat; ';
  a_style += 'height:0; padding-top:20px; overflow:hidden; padding-right:1px;';
  frame.value='';
  frame.value += "<div style='" + div_style + "'>\n";
  frame.value +=
    '<' +
    "iframe src='" +
    tg.src +
    "' style='width:100%; height:" +
    tg.height +
    "; border-bottom:1px #cbcbcb solid;' frameborder='0'></iframe>\n";
  frame.value +=
    "<a href='http://teamgantt.com' target='_blank' style='" +
    a_style +
    "'>Online Gantt Chart</a>\n";
  frame.value += '</div>';
  //FOR LINK 1 (create the a)
  //$id("public_link1").value="<a href='"+tg.src+"' target='_blank'>View my Online Gantt Chart</a>";
  //FOR LINK 2 (just the link)
  $id('public_link2').value=tg.src;
  if (projects.length == 0) {    var select_text='Select at least one project above.';
    //t.value=select_text;
    frame.value=select_text;
    //$id("public_link1").value=select_text;
    $id('public_link2').value=select_text;
  }}
// JavaScript Document
function load_sync(project_ids, return_array, force_resync)
{force_resync=force_resync || false;
var ajaxRequest;  // The variable that makes Ajax possible!
try
{// Opera 8.0+, Firefox, Safari
ajaxRequest=new XMLHttpRequest();
}
catch (e)
{// Internet Explorer Browsers
try
{ajaxRequest=new ActiveXObject("Msxml2.XMLHTTP");
}
catch (e)
{try
{ajaxRequest=new ActiveXObject("Microsoft.XMLHTTP");
}
catch (e)
{// Something went wrong
alert("Your browser broke!");
return false;
}}
}
ajaxRequest.timeout=300000;
// Create a function that will receive data sent from the server
ajaxRequest.onreadystatechange=function()
{var note_main=$id("notes_list");
if(ajaxRequest.readyState != 4)
{}
else if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200)
{var xml=ajaxRequest.responseXML;
var parent=xml.getElementsByTagName("SYNC")[0];
var status=getNodeValue(parent, "STATUS");
$id("sync_background").className="hidden";
$id("basecamp_sync").className="hidden";
load_gantt(return_array);
if(status == "fail")
{custom_alert("The synchronization with basecamp failed. Please verify that your basecamp settings are current in Admin > Manage Basecamp Projects.<br /><br />We recommend you not make any changes to your project, as they will not push successfully to basecamp.<br /><br />If you continue to have troubles, please contact support@teamgantt.com");
}}
else { }}

$id("basecamp_sync").className="";
$id("sync_background").className="";
var queryString="project_ids="+project_ids;
if(force_resync == "1") {queryString += "&force_resync=true";
}
ajaxRequest.open("POST", "../schedule/external_sync.php", true);
ajaxRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
ajaxRequest.send(queryString);
}// JavaScript Document
if(window.FileReader)
{ 
var drop; 
addEventHandler(window, 'load', function() {    var drop  =window;
  
    function cancel(e) {      if (e.preventDefault) { e.preventDefault(); }
      return false;
    }
  
    // Tells the browser that we *can* drop on this target
    addEventHandler(drop, 'dragover', cancel);
    addEventHandler(drop, 'dragenter', cancel);
addEventHandler(drop, 'drop', function (e) { e=e || window.event; // get window.event if e argument missing (in IE)   
 if(e.preventDefault) { e.preventDefault(); } // stops the browser from redirecting off to the image.
var dt   =e.dataTransfer;
var files=dt.files;
for (var i=0; i<files.length; i++)
{var file=files[i];
//attach event handlers here...
if($id("document_upload_iframe") && $id("document_upload_iframe").offsetHeight > 0)
{$id("document_upload_iframe").contentWindow.$('#file_upload').uploadifive('add_queue', file);
}
else if($id("file_upload"))
{$('#file_upload').uploadifive('add_queue', file);
}}
return false;
});
Function.prototype.bindToEventHandler=function bindToEventHandler() {var handler=this;
var boundParameters=Array.prototype.slice.call(arguments);
//create closure
return function(e) {e=e || window.event; // get window.event if e argument missing (in IE)   
boundParameters.unshift(e);
handler.apply(this, boundParameters);
}};
 });
}
function addEventHandler(obj, evt, handler) {    if(obj.addEventListener) {        // W3C method
        obj.addEventListener(evt, handler, false);
    } else if(obj.attachEvent) {        // IE method.
        obj.attachEvent('on'+evt, handler);
    } else {        // Old school method.
        obj['on'+evt]=handler;
    }}// JavaScript Document
function cleanup_change_value(key, value) {  if (key == 'percent complete') {    return value + '%';
  } else if (key == 'dates' || key == 'initial dates') {    var dates=value.split(':');
    var string=pretty_date(dates[0]);
    string += dates[1] != dates[0] ? ' to ' + pretty_date(dates[1]) : '';
    if (string == '') {      string='(no date assigned)';
    }
    return string;
  } else if (key == 'start date' || key == 'end date') {    return pretty_date(value);
  } else {    return value;
  }}
function log_name_convert(target, key, value) {  var return_fail=false;
  if (target == 'task' && key == 'percent complete') {    return ['updated percent complete of', 'green1'];
  } else if (key == 'document') {    if (value.indexOf('deleted:') != 0) {      if (target == 'project') {        return ['uploaded a new file to the project', 'grey1 document'];
      } else {        return ['uploaded a new file to', 'grey1 document'];
      }
    } else if (value.indexOf('deleted:') == 0) {      return ['deleted a file on', 'grey1 document'];
    } else {      return_fail=true;
    }
  } else if ((target == 'task' || target == 'milestone') && key == 'added') {    return ['added a new ' + target, 'blue1'];
  } else if (target == 'group' && key == 'added') {    return ['added a new group', 'blue1'];
  } else if (key == 'comment') {    if (value.indexOf('added:') == 0) {      return ['commented on', 'grey1 comment'];
    } else if (value.indexOf('deleted:') == 0) {      return_fail=true;
    } else {      return ['commented on', 'grey1 comment'];
    }
  } else if ((target == 'task' || target == 'milestone') && key == 'name') {    return ['renamed', 'grey2'];
  } else if (target == 'group' && key == 'name') {    return ['renamed the group', 'grey2'];
  } else if (
    (target == 'task' || target == 'milestone') &&
    key == 'initial dates'
  ) {    return ['scheduled', 'brown1'];
  } else if ((target == 'task' || target == 'milestone') && key == 'dates') {    return ['rescheduled', 'brown1'];
  } else if (
    (target == 'task' || target == 'milestone') &&
    key == 'start date'
  ) {    return ['update the start date of', 'brown1'];
  } else if ((target == 'task' || target == 'milestone') && key == 'end date') {    return ['update the due date of', 'brown1'];
  } else if (
    (target == 'task' || target == 'milestone') &&
    key.toLowerCase() == 'deleted'
  ) {    return ['deleted ' + target, 'purple1'];
  } else if (
    (target == 'task' || target == 'milestone') &&
    key.toLowerCase() == 'estimated_hours'
  ) {    return ['estimated the amount of hours to complete', 'brown1'];
  } else if (target == 'group' && key.toLowerCase() == 'deleted') {    return ['deleted the group', 'purple1'];
  } else if (key == 'added user_id resource') {    return ['assigned', 'black'];
  } else if (key == 'changed user_id resource') {    return ['updated hours assignment', 'black'];
  } else if (key == 'removed user_id resource') {    return ['removed the assignment', 'black'];
  } else if (key == 'added company_resource_id resource') {    return ['assigned', 'black'];
  } else if (key == 'changed company_resource_id resource') {    return ['updated hours assignment', 'black'];
  } else if (key == 'removed company_resource_id resource') {    return ['removed the assignment', 'black'];
  } else if (key == 'added resource_id resource') {    return ['assigned', 'black'];
  } else if (key == 'changed resource_id resource') {    return ['updated hours assignment', 'black'];
  } else if (key == 'removed resource_id resource') {    return ['removed the assignment', 'black'];
  } else if (key == 'note') {    if (value.indexOf('deleted:') == 0) {      return ['deleted the note for', 'grey1 comment'];
    } else {      return ['added the note', 'grey1 comment'];
    }
  } else if (key == 'url') {    return ['added the url', 'grey1 comment'];
  } else if (target == 'project' && key.toLowerCase() == 'invite') {    return ['invited someone to the project', 'black'];
  } else if (key == 'new project') {    return ['moved', 'black'];
  } else {    return_fail=true;
  }
  if (return_fail) {    return ['missing values: ' + target + ' - ' + key, 'hidden'];
  }}
function load_more(force_project) {  force_project=force_project || null;
  _runs++;
  load_activity();
}
var _runs=0;
function load_activity(force_project) {  force_project=force_project || null;
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function() {    if (ajaxRequest.readyState != 4) {    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      //alert(ajaxRequest.responseText);
      var parent=$id('activity_view');
      if (_runs == 0) {        remove_child_nodes(parent);
      }
      var xml=ajaxRequest.responseXML;
      //FREE MESSAGING
      var free_text=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getAttribute('free');
      if ($id('free_message')) {        if (free_text.indexOf('free') > -1) {          $id('free_message').className='';
          $id('activity_view').className='hidden';
          $id('load_more').className='hidden';
          if (free_text.indexOf('admin') > -1) {            $id('free_message_admin').className='';
            $id('free_message_not_admin').className='hidden';
          } else {            $id('free_message_not_admin').className='';
            $id('free_message_admin').className='hidden';
          }
          finish_load();
        } else {          $id('free_message').className='hidden';
          $id('activity_view').className='';
          $id('load_more').className='';
        }
      }
      //TASKS
      var _task=[];
      var tasks=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('TASK');
      for (var t=0; t < tasks.length; t++) {        var id=getNodeValue(tasks[t], 'ID');
        var name=getNodeValue(tasks[t], 'NAME');
        var group_name=getNodeValue(tasks[t], 'GROUP_NAME');
        var start_date=getNodeValue(tasks[t], 'START_DATE');
        var end_date=getNodeValue(tasks[t], 'END_DATE');
        _task[id]=[];
        _task[id]['name']=name;
        _task[id]['group_name']=group_name;
        _task[id]['start_date']=start_date;
        _task[id]['end_date']=end_date;
      }
      //GROUPS
      var _group=[];
      var groups=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('GROUP');
      for (var g=0; g < groups.length; g++) {        var id=getNodeValue(groups[g], 'ID');
        var project_id=getNodeValue(groups[g], 'PROJECT_ID');
        var name=getNodeValue(groups[g], 'NAME');
        _group[id]=[];
        _group[id]['project_id']=project_id;
        _group[id]['name']=name;
      }
      //COMMENTS
      var _comment=[];
      var comments=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('COMMENT');
      for (var t=0; t < comments.length; t++) {        var id=getNodeValue(comments[t], 'ID');
        var message=getNodeValue(comments[t], 'MESSAGE');
        _comment[id]=[];
        _comment[id]['message']=message;
      }
      //USERS
      var _users=[];
      var users=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('USER');
      for (var t=0; t < users.length; t++) {        var id=getNodeValue(users[t], 'ID');
        var name=getNodeValue(users[t], 'NAME');
        var pic=getNodeValue(users[t], 'PIC');
        _users[id]=[];
        _users[id]['name']=name;
        _users[id]['pic']=pic;
      }
      //COMPANY RESOURCES
      var _company_resources=[];
      var company_resources=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('COMPANY_RESOURCE');
      for (var t=0; t < company_resources.length; t++) {        var id=getNodeValue(company_resources[t], 'ID');
        var name=getNodeValue(company_resources[t], 'NAME');
        _company_resources[id]=[];
        _company_resources[id]['name']=name;
      }
      //PROJECT RESOURCES
      var _project_resources=[];
      var project_resources=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('PROJECT_RESOURCE');
      for (var t=0; t < project_resources.length; t++) {        var id=getNodeValue(project_resources[t], 'ID');
        var name=getNodeValue(project_resources[t], 'NAME');
        _project_resources[id]=[];
        _project_resources[id]['name']=name;
      }
      //LOG
      var log_items=xml
        .getElementsByTagName('LOG_ITEMS')[0]
        .getElementsByTagName('ITEM');
      var cur_date=null;
      var cur_project=null;
      //LOOP THROUGH
      for (var i=0; i < log_items.length; i++) {        //GET VALUES
        if (parent) {          var id=getNodeValue(log_items[i], 'ID');
          var location=getNodeValue(log_items[i], 'LOCATION');
          var project_id=getNodeValue(log_items[i], 'PROJECT_ID');
          var project_name=getNodeValue(log_items[i], 'PROJECT_NAME');
          var time_stamp=getNodeValue(log_items[i], 'TIME_STAMP');
          var utc_time_stamp=getNodeValue(log_items[i], 'UTC_TIME_STAMP');
          var target=getNodeValue(log_items[i], 'TARGET');
          var target_id=getNodeValue(log_items[i], 'TARGET_ID');
          var change_key=getNodeValue(log_items[i], 'CHANGE_KEY');
          var change_value=cleanup_change_value(
            change_key,
            getNodeValue(log_items[i], 'CHANGE_VALUE')
          );
          var user_id=getNodeValue(log_items[i], 'USER_ID');
          var user_name=getNodeValue(log_items[i], 'USER_NAME');
          var can_undo=getNodeValue(log_items[i], 'CAN_UNDO');
          var previous_value=getNodeValue(log_items[i], 'PREVIOUS_VALUE');
          var log_date=time_stamp.split(' ')[0];
          if (log_date != cur_date) {            cur_date=log_date;
            cur_project=null;
            var display_date=pretty_date(cur_date);
            var date_break=$create('DIV');
            date_break.className='date_break';
            parent.appendChild(date_break);
            var back_line=$create('DIV');
            back_line.className='back_line';
            date_break.appendChild(back_line);
            var span=$create('SPAN');
            span.appendChild($text(display_date));
            date_break.appendChild(span);
          }
          if (project_id != cur_project) {            cur_project=project_id;
            var project_parent=$create('DIV');
            project_parent.className='project';
            var project_name_div=$create('DIV');
            project_name_div.className='project_name';
            project_name_div.appendChild($text(project_name));
            project_parent.appendChild(project_name_div);
            parent.appendChild(project_parent);
          }
          //DISPLAY MESSAGE
          var div=$create('DIV');
          div.className='log_item';
          project_parent.appendChild(div);
          var pic_src=_users[user_id] ? _users[user_id]['pic'] : '';
          pic_src=pic_src != '' ? pic_src : '/_user_icons/user_0_50_50.jpg';
          var user_image=$create('IMG');
          user_image.setAttribute('SRC', pic_src);
          user_image.className='user_image';
          div.appendChild(user_image);
          var name=$create('SPAN');
          name.className='user_name';
          name.appendChild($text(user_name));
          div.appendChild(name);
          var change_span=$create('SPAN');
          change_span.className='change_key';
          var log_info=log_name_convert(target, change_key, change_value);
          change_span.appendChild($text(' ' + log_info[0]));
          div.appendChild(change_span);
          //NOW WE KNOW THE ACTION - ADD THE STYLING
          div.className += ' ' + log_info[1];
          //NAME w/GROUP
          if (target == 'task' || target == 'milestone') {            var task=_task[target_id];
            if (task) {              var task_name_string =
                change_key == 'name' ? previous_value : task['name'];
              var group=$create('DIV');
              group.className='group_name';
              group.appendChild($text(task['group_name']));
              //div.appendChild(group);
              var task_name=$create('DIV');
              task_name.className='task_name';
              task_name.title=task['group_name'] + ' : ' + task_name_string;
              task_name.appendChild($text(task_name_string));
              if (change_key == 'name' && previous_value == '') {                div.parentNode.removeChild(div);
              } else if (change_key == 'comment') {                var span=$create('DIV');
                span.className='change_value';
                var comment_id=change_value.split(':')[1];
                var comment=_comment[comment_id]
                  ? _comment[comment_id]['message']
                  : 'This comment has since been deleted.';
                if (change_value.indexOf('added:') != 0) {                  comment=change_value;
                }
                span.appendChild($text(comment));
                task_name.appendChild(span);
              } else if (change_key == 'note') {                if (log_info[0] != 'deleted the note for') {                  var span=$create('DIV');
                  span.className='change_value';
                  span.appendChild($text(change_value));
                  task_name.appendChild(span);
                }
              } else if (change_key == 'added') {                // DO NOTHING
                /*
if(target == "task") {task_name.appendChild($text( " (" + cleanup_change_value("dates", task['start_date']+":"+task['end_date']) +")" ));
}
else if(target == "milestone") {task_name.appendChild($text( " (" + cleanup_change_value("dates", task['end_date']+":"+task['end_date']) +")" ));
}
*/
              } else if (
                change_key == 'added user_id resource' ||
                change_key == 'removed user_id resource' ||
                change_key == 'changed user_id resource'
              ) {                var to_wording =
                  change_key == 'added user_id resource' ? ' to: ' : ' from: ';
                var data_split=change_value.split('-');
                var name=data_split[0];
                var hours_per_day=data_split[1] || '';
                var total_hours=data_split[2] || '';
                task_name.appendChild($text(to_wording));
                var span=$create('SPAN');
                span.className='change_value';
                var res_name=_users[name]
                  ? _users[name]['name']
                  : 'unknown user';
                span.appendChild($text(res_name));
                if (hours_per_day != '' || total_hours != '') {                  span.appendChild($text(' (' + hours_per_day + ' hours/day)'));
                }
                task_name.appendChild(span);
              } else if (
                change_key == 'added company_resource_id resource' ||
                change_key == 'removed company_resource_id resource' ||
                change_key == 'changed company_resource_id resource'
              ) {                var to_wording =
                  change_key == 'added company_resource_id resource'
                    ? ' to: '
                    : ' from: ';
                var data_split=change_value.split('-');
                var name=data_split[0];
                var hours_per_day=data_split[1] || '';
                var total_hours=data_split[2] || '';
                task_name.appendChild($text(to_wording));
                var span=$create('SPAN');
                span.className='change_value';
                var res_name=_company_resources[name]
                  ? _company_resources[name]['name']
                  : 'unknown company resource';
                span.appendChild($text(res_name));
                if (hours_per_day != '' || total_hours != '') {                  span.appendChild($text(' (' + hours_per_day + ' hours/day)'));
                }
                task_name.appendChild(span);
              } else if (
                change_key == 'added resource_id resource' ||
                change_key == 'removed resource_id resource' ||
                change_key == 'changed resource_id resource'
              ) {                var to_wording =
                  change_key == 'added resource_id resource'
                    ? ' to: '
                    : ' from: ';
                var data_split=change_value.split('-');
                var name=data_split[0];
                var hours_per_day=data_split[1] || '';
                var total_hours=data_split[2] || '';
                task_name.appendChild($text(to_wording));
                var span=$create('SPAN');
                span.className='change_value';
                if (_project_resources[name]) {                  span.appendChild($text(_project_resources[name]['name']));
                } else {                  span.appendChild($text('*resource no longer available*'));
                }
                if (hours_per_day != '' || total_hours != '') {                  span.appendChild($text(' (' + hours_per_day + ' hours/day)'));
                }
                task_name.appendChild(span);
              } else if (change_key == 'new project') {                task_name.appendChild($text(' to the the project: '));
                var bld=$create('B');
                bld.appendChild($text(project_name));
                task_name.appendChild(bld);
              } else if (change_key.toLowerCase() == 'deleted') {                //DO NOTHING
              } else {                if (change_key == 'document') {                  task_name.appendChild($text(': '));
                } else {                  task_name.appendChild($text(' to: '));
                }
                var span=$create('SPAN');
                span.className='change_value';
                change_value =
                  change_value.indexOf('deleted:') == 0
                    ? change_value.replace('deleted:', '')
                    : change_value;
                span.appendChild($text(change_value));
                task_name.appendChild(span);
              }
              div.appendChild(task_name);
              var upper_links=$create('DIV');
              upper_links.className='upper_links';
              div.appendChild(upper_links);
              //RESTORE LINK
              if (can_undo == 1) {                var restore=$create('DIV');
                restore.className='undo_change';
                restore.setAttribute('project_id', project_id);
                restore.setAttribute('location', location);
                restore.setAttribute('location_id', id);
                restore.setAttribute('time_stamp', utc_time_stamp);
                restore.setAttribute('target', target);
                restore.setAttribute('target_id', target_id);
                restore.setAttribute('change_key', change_key);
                restore.appendChild($text('undo change'));
                restore.onclick=function() {                  restore_action(this);
                };
                upper_links.appendChild(restore);
              }
            } else {              div.appendChild($text(' - This task has since been deleted'));
              //REMOVE NODE
              div.parentNode.removeChild(div);
            }
          } else if (target == 'group') {            var group=_group[target_id];
            if (group) {              if (change_key == 'added') {                var group_div=$create('DIV');
                group_div.className='group_name';
                group_div.appendChild($text(group['name']));
                div.appendChild(group_div);
              } else if (change_key == 'name') {                if (previous_value != '') {                  var group_div=$create('DIV');
                  group_div.className='group_name';
                  group_div.appendChild(
                    $text(previous_value + ' to: ' + change_value)
                  );
                  div.appendChild(group_div);
                } else {                  div.parentNode.removeChild(div);
                }
              } else if (change_key == 'comment') {                var group_div=$create('DIV');
                group_div.className='group_name';
                group_div.appendChild($text(group['name'] + ': '));
                div.appendChild(group_div);
                var span=$create('DIV');
                span.className='change_value';
                var comment_id=change_value.split(':')[1];
                var comment=_comment[comment_id]
                  ? _comment[comment_id]['message']
                  : 'This comment has since been deleted.';
                if (change_value.indexOf('added:') != 0) {                  comment=change_value;
                }
                span.appendChild($text(comment));
                group_div.appendChild(span);
              } else if (change_key.toLowerCase() == 'deleted') {                var group_div=$create('DIV');
                group_div.className='group_name';
                group_div.appendChild($text(group['name']));
                div.appendChild(group_div);
              } else {                var group_div=$create('DIV');
                group_div.className='group_name';
                group_div.appendChild($text(group['name'] + ': '));
                div.appendChild(group_div);
                var span=$create('SPAN');
                span.className='change_value';
                span.appendChild($text(change_value));
                group_div.appendChild(span);
              }
            }
            var upper_links=$create('DIV');
            upper_links.className='upper_links';
            div.appendChild(upper_links);
            //RESTORE LINK
            if (can_undo == 1) {              var restore=$create('DIV');
              restore.className='undo_change';
              restore.setAttribute('project_id', project_id);
              restore.setAttribute('location', location);
              restore.setAttribute('location_id', id);
              restore.setAttribute('time_stamp', time_stamp);
              restore.setAttribute('target', target);
              restore.setAttribute('target_id', target_id);
              restore.setAttribute('change_key', change_key);
              restore.appendChild($text('undo change'));
              restore.onclick=function() {                restore_action(this);
              };
              upper_links.appendChild(restore);
            }
          } else if (target == 'project') {            if (change_key.toLowerCase() == 'invite') {              var text1=change_value.split('has invited ');
              var text2=text1[1].split(' to project');
              var string=text2[0].replace('[', '- ');
              string=string.replace(']', '');
              var who_invited=$create('DIV');
              who_invited.className='task_name';
              who_invited.appendChild($text(string));
              div.appendChild(who_invited);
            } else {              var group_div=$create('DIV');
              group_div.className='group_name';
              div.appendChild(group_div);
              var span=$create('SPAN');
              span.className='change_value';
              span.appendChild($text(change_value));
              group_div.appendChild(span);
            }
          }
          var t_stamp=$create('DIV');
          t_stamp.className='time_stamp';
          time_stamp=time_stamp.replace(/-/g, '/');
          t_stamp.appendChild($text(dateFormat(time_stamp, 'shortTime')));
          div.appendChild(t_stamp);
        }
        finish_load();
      }
    } else {    }
  };
  var queryString =
    'project_ids=' + tweak_text_for_get($id('project_ids').value);
  if ($id('project_edit_id') && $id('project_edit_id').value != '') {    queryString =
      'project_ids=' + tweak_text_for_get($id('project_edit_id').value);
  } else if (force_project != null) {    queryString='project_ids=' + tweak_text_for_get(force_project);
    $id('load_more').setAttribute('force_project', force_project);
    $id('load_more').onclick=function() {      load_more(this.getAttribute('force_project'));
    };
  }
  queryString += '&limit=' + _runs;
  queryString += get_filters();
  queryString += get_target_filters();
  //SET TAB
  if (_version && _version == 'summary') {    queryString += '&summary=true';
  }
  ajaxRequest.open('POST', '../history/xml.activity.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function get_target_filters() {  if ($id('edit_window') && $id('edit_window').offsetHeight > 0) {    var d=$id('edit_window');
    var target=d.getAttribute('target');
    var target_id=d.getAttribute('target_id');
    if (target != '' && target_id != '' && target != 'project') {      return '&target=' + target + '&target_id=' + target_id;
    } else {      return '';
    }
  } else {    return '';
  }}
function get_filters() {  if ($id('filters')) {    var inputs=$id('filters').getElementsByTagName('INPUT');
    var set_filters=[];
    for (i=0; i < inputs.length; i++) {      if (inputs[i].checked == true) {        set_filters.push(inputs[i].name);
      }
      inputs[i].onclick=function() {        _runs=0;
        load_activity();
      };
    }
    return set_filters.length > 0 ? '&filters=' + set_filters.join(',') : '';
  } else {    return '';
  }}
function restore_action(ele, do_others) {  do_others=do_others || '';
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function() {    if (ajaxRequest.readyState != 4) {    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var response=ajaxRequest.responseText;
      if (
        ele.getAttribute('change_key') == 'dates' &&
        response.indexOf('multiple') > -1
      ) {        response=response.replace('multiple:', '');
        var conf=custom_confirm(
          'There are ' +
            response +
            ' other tasks rescheduled at the same time. Would you like to undo those changes as well?'
        );
        conf['yes'].onclick=function() {          restore_action(ele, 'Yes');
          this.ondblclick();
        };
        conf['no'].onclick=function() {          restore_action(ele, 'No');
          this.ondblclick();
        };
      } else {        _runs=0;
        load_activity();
      }
      if ($id('edit_window')) {        $id('edit_window').setAttribute('on_close', 'refresh');
      }
    } else {    }
  };
  track_segment_event('performed-undo');
  var queryString =
    'action=' + tweak_text_for_get(ele.getAttribute('change_key'));
  queryString +=
    '&project_id=' + tweak_text_for_get(ele.getAttribute('project_id'));
  queryString +=
    '&location=' + tweak_text_for_get(ele.getAttribute('location'));
  queryString +=
    '&location_id=' + tweak_text_for_get(ele.getAttribute('location_id'));
  queryString += '&target=' + tweak_text_for_get(ele.getAttribute('target'));
  queryString +=
    '&target_id=' + tweak_text_for_get(ele.getAttribute('target_id'));
  queryString +=
    '&time_stamp=' + tweak_text_for_get(ele.getAttribute('time_stamp'));
  queryString += '&do_others=' + tweak_text_for_get(do_others);
  ajaxRequest.open('POST', '../history/activity_restore.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function close_message() {  var div=$id('message');
  div.parentNode.removeChild(div);
  update_preference({activity_message1: 'close'});
}
// JavaScript Document
/* TIME TRACKING & TIME SHEETS */
function move_day(direction) {  _npo=false;
  _no_date=false;
  //GET CURRENT PARTS
  var the_date=_date.split('-');
  var year=the_date[0];
  var month=the_date[1] - 1; //convert to js month format
  var day=the_date[2];
  //UPDATE THE DAYS MOVED
  if (direction == 'back') {    if (_view == 'daily') {      day--;
    } else if (_view == 'weekly') {      day=day - 7;
    }
  } else {    if (_view == 'daily') {      day++;
    } else if (_view == 'weekly') {      day=day * 1 + 7;
    }
  }
  //PUT DATE BACK TOGETHER
  var new_date=new Date();
  new_date.setFullYear(year, month, day);
  //CONVERT TO REAL DATE
  year=new_date.getFullYear();
  month=to_two(new_date.getMonth() * 1 + 1);
  day=to_two(new_date.getDate());
  _date=year + '-' + month + '-' + day;
  //REFRESH DATA
  load_tasks();
  clear_text();
  update_display_date();
}
function update_display_date() {  //UPDATE DISPLAY TEXT
  var word_days=_view == 'daily' ? 'yes' : 'no';
  var text=_date == _today ? 'Today' : pretty_date(_date, word_days);
  if (_view == 'weekly') {    text=text + ' - ' + pretty_date(next_day(_date, 6), 'no');
  }
  $id('display_date').firstChild.nodeValue=text;
  if ($id('today_message')) {    if (_view == 'daily' && _date == _today) {      $id('today_message').className='';
    } else {      $id('today_message').className='hidden';
    }
  }}
function open_time_tracking_meta(ele) {  if (isNaN(ele.getAttribute('task_id'))) {    return;
  }
  unhighlight_all();
  open_tracking_task(ele);
  open_meta_popup('task', ele.getAttribute('task_id'), ele, 425);
  $id('punch_in_background').className='hidden';
  var div=$id('punch_in');
  var parent=$id('time_tracking_overlay');
  remove_child_nodes(parent);
  parent.appendChild(div);
  $id('meta_popup').className=$id('meta_popup').className.replace(
    /checklist/g,
    ''
  );
  $id('meta_target').className=$id('meta_target').className.replace(
    /checklist/g,
    ''
  );
}
function open_tracking_task(ele) {  time_tracking_check_current();
  var bg=$id('punch_in_background');
  var div=$id('punch_in');
  var name=$id('punch_in_header');
  var button=$id('punch_in_button');
  bg.className='';
  div.className='';
  remove_child_nodes(name);
  name.appendChild(
    $text(_tasks[_tasks_key[ele.getAttribute('task_id')]]['task_name'])
  );
  button.setAttribute('task_id', ele.getAttribute('task_id'));
  button.setAttribute('project_id', ele.getAttribute('project_id'));
  bring_to_front(bg);
  bring_to_front(div);
  if (_version == 'time-tracking') {    button.onclick=function () {      save_time_tracking(
        $id('track_time_button_' + this.getAttribute('task_id')),
        'start_time'
      );
      close_tracking();
      if ((track_more=$id('track_more_' + ele.getAttribute('task_id')))) {        track_more.className += ' hidden';
      }
    };
  } else {    button.onclick=function () {      save_time_tracking(this, 'start_time');
      close_tracking();
      track_segment_event('gantt-started-time-tracking-task-badge');
    };
  }
  $id('punch_in_hours').value='';
  $id('punch_in_submit').setAttribute('task_id', ele.getAttribute('task_id'));
  $id('punch_in_submit').setAttribute(
    'project_id',
    ele.getAttribute('project_id')
  );
  $id('punch_in_hours').focus();
  //FOOTER
  $id('punch_in_footer').setAttribute('task_id', ele.getAttribute('task_id'));
  $id('punch_in_footer').onclick=function () {    close_tracking();
    edit_times(this.getAttribute('task_id'), null);
  };
  //FOOTER ALL
  if ((footer_all=$id('punch_in_footer_all'))) {    footer_all.setAttribute('task_id', ele.getAttribute('task_id'));
    footer_all.onclick=function () {      close_tracking();
      edit_times(this.getAttribute('task_id'), null, true);
    };
  }}
var _last_task_punchout_details=[];
function time_tracking_check_current() {  var loading=$id('punch_in_loading');
  var punched_in_task=$id('punch_in_already_punched_in');
  var punched_in_task_is_current_task=$id('punch_out_already_punched_in');
  var punch_in_controls=$id('punch_in_controls');
  var congrats=$id('punch_in_already_confirm');
  loading.className='';
  punched_in_task.className='hidden';
  punched_in_task_is_current_task.className='hidden';
  punch_in_controls.className='hidden';
  congrats.className='hidden';
  var ajax=new _ajax();
  ajax.queryString='flag=check_punched_in';
  ajax.url =
    '/' + $id('js_gantt_url').value + '/time-tracking/json.time-tracking.php';
  ajax.response=function () {    var response=json_decode(this.responseText);
    var loading=$id('punch_in_loading');
    var punched_in_task=$id('punch_in_already_punched_in');
    var punched_in_task_is_current_task=$id('punch_out_already_punched_in');
    var punched_in_task_id=response.data.task_id;
    var current_task_id=$id('punch_in_submit').getAttribute('task_id');
    var punch_in_controls=$id('punch_in_controls');
    var congrats=$id('punch_in_already_confirm');
    var is_punched_in_to_current_task=punched_in_task_id == current_task_id;
    if (response.punched_in == true) {      //RESOURCE IS PUNCHED IN
      punch_in_controls.className='hidden';
      congrats.className='hidden';
      loading.className='hidden';
      let element_name;
      let element_button_text;
      let element_title;
      if (is_punched_in_to_current_task) {        punched_in_task_is_current_task.className='';
        element_name='punch_in_punch_out_current_task_name';
        element_button_text='click here.';
        element_title='Click here to punch out.';
      } else {        punched_in_task.className='';
        element_name='punch_in_punch_out_task_name';
        element_button_text='punch out of "' + response.data.task_name + '"';
        element_title="Click task's name to punch out of it.";
      }
      //PUNCH OUT BUTTON
      var ele=$id(element_name);
      ele.firstChild.nodeValue=element_button_text;
      ele.setAttribute('task_id', response.data.task_id);
      ele.setAttribute('project_id', response.data.project_id);
      ele.setAttribute('time_id', response.data.time_id);
      ele.title=element_title;
      if (_tasks && _tasks_key && _tasks[_tasks_key[response.data.task_id]]) {        ele.onclick=function () {          if (
            (punch_out_button=$id(
              'track_time_button_' + this.getAttribute('task_id')
            ))
          ) {            //PUNCH OUT BUTTON IS PRESENT - CLICK IT
            punch_out_button.click();
            punched_in_task.className='hidden';
            punched_in_task_is_current_task.className='hidden';
            $id('punch_in_controls').className='';
          } else {            //PUNCH OUT OF THE CURRENT TASKS
            var punch_out=new _ajax();
            punch_out.queryString =
              'flag=end_time&task_id=' +
              this.getAttribute('task_id') +
              '&project_id=' +
              this.getAttribute('project_id') +
              '&time_id=' +
              this.getAttribute('time_id');
            punch_out.url =
              '/' +
              $id('js_gantt_url').value +
              '/time-tracking/save.time-tracking.php';
            punch_out.response=function () {              var server_response=json_decode(this.responseText);
              punched_in_task.className='hidden';
              punched_in_task_is_current_task.className='hidden';
              $id('punch_in_controls').className='';
              $id('punch_in_already_confirm').className='';
              //REMOVE HIGHLIGHT ON CLOCK
              if ((div=$id('task_meta_' + ele.getAttribute('task_id')))) {                var divs=div.getElementsByTagName('DIV');
                for (var d=0; d < divs.length; d++) {                  if (divs[d].className.indexOf('meta_time_tracking') > -1) {                    divs[d].className=trim(
                      divs[d].className.replace(/user_punched_in/g, '')
                    );
                    divs[d].className=trim(
                      divs[d].className.replace(/punched_in/g, '')
                    );
                  }
                }
              }
              //CONGRATS MESSAGE
              $id('punch_in_already_task_name').firstChild.nodeValue =
                server_response.task_name;
              $id('punch_in_already_edit_times').setAttribute(
                'task_id',
                server_response.task_id
              );
              _last_task_punchout_details=server_response;
              $id('punch_in_already_edit_times').onclick=function () {                open_time_closeout(
                  this.getAttribute('task_id'),
                  _last_task_punchout_details
                );
              };
              //UPDATE COUNTS IF THEY EXIST
              if ($id('category_task_list')) {                _tasks[_tasks_key[server_response.task_id]]['actual_hours'] =
                  server_response.total_hours;
                //COLUMN
                if ((d=$id('task_actual_hours_' + server_response.task_id))) {                  remove_child_nodes(d);
                  d.appendChild($text(server_response.total_hours));
                }
                //BAR
                display_actual_hours_bar(server_response.task_id);
              }
              gtt.fetch_current();
            };
            punch_out.run();
          }
        };
      } else {        // CURRENT PUNCHED IN TASK IS NOT IN ANY OPEN PROJECT - OPEN GTT
        ele.onclick=function () {          $id('global_time_tracker_icon').click();
        };
      }
    } else {      //RESOURCE IS NOT PUNCHED IN
      punched_in_task.className='hidden';
      punched_in_task_is_current_task.className='hidden';
      punch_in_controls.className='';
      loading.className='hidden';
      gtt.fetch_current();
    }
  };
  ajax.run();
}
function close_tracking() {  var bg=$id('punch_in_background');
  var div=$id('punch_in');
  var name=$id('punch_in_header');
  var button=$id('punch_in_button');
  hide_backdrop();
  if (div.parentNode.id == 'time_tracking_overlay') {    document.body.insertBefore($id('punch_in'), $id('punch_in_background'));
    complete_close_meta_popup();
  }
  bg.className='hidden';
  div.className='hidden';
  button.onclick=null;
  button.setAttribute('task_id', '');
  $id('punch_in_hours').value='';
  $id('punch_in_submit').setAttribute('task_id', '');
  $id('punch_in_submit').setAttribute('project_id', '');
}
function edit_times(task_id, ele, load_all) {  click_current_backdrop();
  hide_backdrop();
  load_all=load_all || false;
  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState != 4) {    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var xml=ajaxRequest.responseXML;
      var div=$create('DIV');
      div.id='edit_times_div';
      div.className='time_tracking';
      div.setAttribute('task_id', task_id);
      document.body.appendChild(div);
      //TASK NAME
      var task_name=$create('DIV');
      task_name.className='edit_time_task_name';
      task_name.appendChild($text(getNodeValue(xml, 'TASK_NAME')));
      div.appendChild(task_name);
      //ADD TIME FORM
      var add_div=$create('DIV');
      add_div.className='add_time_div';
      add_div.appendChild($text('Insert Hours: '));
      div.appendChild(add_div);
      //SELECT DATE
      var add_date=$create('INPUT');
      add_date.type='text';
      add_date.setAttribute('placeholder', 'Select Date');
      add_date.onchange=function () {        $id('new_time_submit').disabled=false;
      };
      add_date.id='new_time_date';
      add_date.onclick=function () {        var cal=generate_calendar(this, this);
      };
      add_div.appendChild(add_date);
      //ENTER HOURS
      var hours=$create('INPUT');
      hours.type='text';
      hours.size=6;
      hours.id='hours_input';
      hours.setAttribute('placeholder', '00:00');
      hours.style.marginLeft='1em';
      add_div.appendChild(hours);
      add_div.appendChild($text(' hours'));
      //SUBMIT BUTTON
      var submit_time=$create('DIV');
      submit_time.className='green_button button_small';
      submit_time.id='new_time_submit';
      submit_time.setAttribute('task_id', task_id);
      submit_time.appendChild($text('Insert Time'));
      submit_time.onclick=function () {        var dt=tweak_text_for_get(
          $id('new_time_date').getAttribute('raw_date')
        );
        var hours=tweak_text_for_get($id('hours_input').value);
        if (dt == '' || hours == '') {          custom_alert('Please enter both a date & an amount of hours');
        } else {          var ajax=new _ajax();
          ajax.url='../time-tracking/save.time-tracking.php';
          ajax.queryString =
            'flag=add_hours&task_id=' +
            tweak_text_for_get(this.getAttribute('task_id')) +
            '&dt=' +
            dt +
            '&hours=' +
            hours;
          ajax.response=function () {            if ((ele=$id('edit_times_div'))) {              var task_id=ele.getAttribute('task_id');
              var load_all=ele.getAttribute('load_all') == 1 ? true : false;
              edit_times(task_id, null, load_all);
              setTimeout(function () {                load_tasks();
              }, 1000);
            }
          };
          ajax.run();
        }
      };
      add_div.appendChild(submit_time);
      //DONE BUTTON
      var done_div=$create('DIV');
      done_div.id='edit_times_done';
      div.appendChild(done_div);
      var done_button=$create('BUTTON');
      done_button.className='blue_button';
      done_button.appendChild($text('Done'));
      done_button.onclick=function () {        $id('edit_times_div_background').click();
      };
      done_div.appendChild(done_button);
      //WRAPPER
      var wrapper=$create('DIV');
      wrapper.id='edit_times_wrapper';
      var from_top=add_div.offsetTop * 1 + add_div.offsetHeight * 1;
      wrapper.style.top=from_top + 'px';
      div.appendChild(wrapper);
      //TIMES TABLE
      var table=$create('TABLE');
      table.setAttribute('width', '95%');
      table.setAttribute('align', 'center');
      table.setAttribute('cellspacing', 0);
      table.setAttribute('border', 0);
      wrapper.appendChild(table);
      //HEADER ROW
      var row=table.insertRow(0);
      var cell_num=0;
      if (load_all) {        var cell=row.insertCell(cell_num);
        cell_num++;
        cell.className='title';
        cell.appendChild($text('Name'));
        cell.style.width='200px';
        div.setAttribute('load_all', 1);
      }
      var cell=row.insertCell(cell_num);
      cell_num++;
      cell.className='title';
      cell.appendChild($text('Start Time'));
      var cell=row.insertCell(cell_num);
      cell_num++;
      cell.className='title';
      cell.appendChild($text('End Time'));
      var cell=row.insertCell(cell_num);
      cell_num++;
      cell.className='title';
      cell.appendChild($text('Duration (hours)'));
      cell.style.textAlign='center';
      var cell=row.insertCell(cell_num);
      cell_num++;
      cell.className='title';
      cell.style.textAlign='center';
      cell.appendChild($text('delete'));
      var times=xml.getElementsByTagName('TIME');
      for (var t=0; t < times.length; t++) {        var id=getNodeValue(times[t], 'ID');
        var user=times[t].getAttribute('user');
        var name=getNodeValue(times[t], 'NAME');
        var start=getNodeValue(times[t], 'START');
        var end=getNodeValue(times[t], 'END');
        var duration=getNodeValue(times[t], 'DURATION');
        var tracking_type=getNodeValue(times[t], 'TRACKING_TYPE');
        var editable=times[t].getAttribute('editable');
        var row_num=table.rows.length;
        var row=table.insertRow(row_num);
        row.id='time_row_' + id;
        var cell_num=0;
        //NAME
        if (load_all) {          var cell=row.insertCell(cell_num);
          cell_num++;
          cell.appendChild($text(name));
        }
        //START DATE
        var cell=row.insertCell(cell_num);
        cell_num++;
        var start_date=start.split(' ')[0];
        var start_time=start.split(' ')[1];
        if (editable == 1) {          if (tracking_type == 'punched') {            var input=$create('INPUT');
            input.type='hidden';
            input.id='start_date_' + id;
            input.value=start_date;
            input.setAttribute('raw_date', start_date);
            cell.appendChild(input);
            cell.appendChild($text(pretty_date(start_date) + ' '));
            var drops=build_dropdown(cell, start_time, id);
            drops[0].id='start_hour_' + id;
            drops[0].onchange=function () {              save_time(this);
            };
            drops[1].id='start_minute_' + id;
            drops[1].onchange=function () {              save_time(this);
            };
          } else {            cell.appendChild($text(pretty_date(start_date)));
          }
        } else {          cell.appendChild(
            $text(
              pretty_date(start_date) +
                ' ' +
                pretty_time(start_date + ' ' + start_time)
            )
          );
        }
        //END DATE
        if (end === '') {          row.className='not_punched_out';
        }
        var cell=row.insertCell(cell_num);
        cell_num++;
        var end_date=end != '' ? end.split(' ')[0] : '';
        var end_time=end != '' ? end.split(' ')[1] : '';
        if (editable == 1) {          if (tracking_type == 'punched') {            var wrapper=$create('DIV');
            cell.appendChild(wrapper);
            var end_date_picker=$create('SPAN');
            end_date_picker.id='end_date_' + id;
            end_date_picker.className='date';
            end_date_picker.appendChild($text(pretty_date(end_date)));
            end_date_picker.setAttribute('time_id', id);
            end_date_picker.setAttribute('raw_date', end_date);
            end_date_picker.setAttribute('disable_before', start_date);
            end_date_picker.onclick=function () {              generate_calendar(
                this,
                this.parentNode,
                this.getAttribute('disable_before'),
                null,
                null
              );
            };
            end_date_picker.onchange=function () {              save_time(this);
            };
            wrapper.appendChild(end_date_picker);
            var drops=build_dropdown(wrapper, end_time, id);
            drops[0].id='end_hour_' + id;
            drops[0].onchange=function () {              save_time(this);
            };
            drops[1].id='end_minute_' + id;
            drops[1].onchange=function () {              save_time(this);
            };
            if (end == '') {              wrapper.className='hidden';
              row.className='not_punched_out';
              var add_time=$create('SPAN');
              add_time.className='add_time';
              add_time.appendChild($text('set end time'));
              add_time.setAttribute('time_id', id);
              add_time.setAttribute('task_id', task_id);
              add_time.setAttribute('date', start_date);
              add_time.setAttribute('time', start_time);
              add_time.onclick=function () {                //SET END DATE
                $id('end_date_' + this.getAttribute('time_id')).value =
                  pretty_date(this.getAttribute('date'));
                $id('end_date_' + this.getAttribute('time_id')).setAttribute(
                  'raw_date',
                  this.getAttribute('date')
                );
                //SET END HOUR
                var hour=this.getAttribute('time').split(':')[0];
                $id('end_hour_' + this.getAttribute('time_id')).value=hour;
                //SET END HOUR
                var minute=this.getAttribute('time').split(':')[1];
                $id('end_minute_' + this.getAttribute('time_id')).value =
                  minute;
                //UPDATE GANTT/LIST
                if ((div=$id('task_meta_' + this.getAttribute('task_id')))) {                  var divs=div.getElementsByTagName('DIV');
                  for (var d=0; d < divs.length; d++) {                    if (divs[d].className.indexOf('meta_time_tracking') > -1) {                      divs[d].className=trim(
                        divs[d].className.replace(/user_punched_in/g, '')
                      );
                      divs[d].className=trim(
                        divs[d].className.replace(/punched_in/g, '')
                      );
                    }
                  }
                }
                //SAVE & FINISH UP
                this.previousSibling.className='';
                this.parentNode.nextSibling.firstChild.nodeValue='...';
                this.parentNode.parentNode.className='';
                $id('end_date_' + this.getAttribute('time_id')).onchange();
                this.parentNode.removeChild(this);
              };
              cell.appendChild(add_time);
            }
          } else {            cell.appendChild($text(' --- '));
          }
        } else {          if (tracking_type == 'punched') {            var end_text =
              end_date === ''
                ? '! not punched out'
                : pretty_date(end_date) +
                  ' ' +
                  pretty_time(end_date + ' ' + end_time);
            cell.appendChild($text(end_text));
          } else {            cell.appendChild($text(' --- '));
          }
        }
        //DURATION
        var cell=row.insertCell(cell_num);
        cell_num++;
        cell.style.textAlign='center';
        if (end != '') {          var input=$create('INPUT');
          input.size=6;
          input.id='task_duration_' + id;
          input.value=duration;
          input.setAttribute('user_id', user);
          input.setAttribute('task_id', task_id);
          input.onchange=function () {            update_time(this);
            this.value=format_time(this.value)[_time_format];
          };
          input.onfocus=function () {            this.select();
          };
          input.onmouseup=function () {            this.select();
          };
          cell.appendChild(input);
        } else {          cell.appendChild($text(' '));
          cell.className='not_punched_out';
        }
        //DELETE TIME
        var cell=row.insertCell(cell_num);
        cell_num++;
        if (editable === 1 || editable === '1') {          var x=$create('SPAN');
          x.className='delete_time';
          x.setAttribute('user_id', user);
          x.setAttribute('time_id', id);
          x.setAttribute('task_id', task_id);
          x.onclick=function () {            delete_time(this);
          };
          x.appendChild($text('x'));
          cell.appendChild(x);
        }
      }
      var rows=table.rows.length;
      var row=table.insertRow(rows);
      var cell=row.insertCell(0);
      var colspan=load_all ? 3 : 2;
      cell.setAttribute('colspan', colspan);
      cell.appendChild($text(' '));
      var cell=row.insertCell(1);
      cell.id='edit_times_total_time';
      cell.style.fontWeight='bold';
      cell.style.textAlign='center';
      cell.appendChild($text('##'));
      var cell=row.insertCell(2);
      cell.appendChild($text(' '));
      edit_times_total();
      //BRING TO FRONT
      bring_to_front($id('edit_times_div_background'));
      bring_to_front($id('edit_times_div'));
    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 0) {      //RE RUN
      edit_times(task_id, ele);
    } else {    }
  };
  //SET BACKGROUND COVER
  if (!$id('edit_times_div_background')) {    var background=build_background_cover();
    background.id='edit_times_div_background';
    background.className += ' full_width';
    background.setAttribute('refresh', 0);
    background.onclick=function () {      while ($id('edit_times_div')) {        var d=$id('edit_times_div');
        d.parentNode.removeChild(d);
      }
      if (this.getAttribute('refresh') == 1) {        load_tasks();
      }
      this.parentNode.removeChild(this);
      hide_backdrop();
    };
  }
  //REMOVE TRACKING DIV
  while ($id('edit_times_div')) {    $id('edit_times_div').parentNode.removeChild($id('edit_times_div'));
  }
  var queryString='task_id=' + tweak_text_for_get(task_id);
  if (load_all == true) {    queryString += '&all=true';
  }
  ajaxRequest.open('POST', '../time-tracking/xml.task_times.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function edit_times_total() {  var div=$id('edit_times_wrapper');
  if (div) {    var total=0;
    var inputs=div.getElementsByTagName('INPUT');
    for (var i=0; i < inputs.length; i++) {      if (inputs[i].id.indexOf('task_duration') == 0) {        total += format_time(inputs[i].value)['decimal_extended'] * 10000;
      }
    }
    remove_child_nodes($id('edit_times_total_time'));
    $id('edit_times_total_time').appendChild(
      $text(format_time(total / 10000)[_time_format])
    );
  }}
function update_time(ele) {  var user_id=ele.getAttribute('user_id');
  var task_id=ele.getAttribute('task_id');
  var time_id=ele.id.replace('task_duration_', '');
  var url='../time-tracking/save.time-tracking.php';
  var qString=[];
  qString['flag']='adjust_time';
  qString['time_id']=time_id;
  qString['task_id']=task_id;
  qString['user_id']=user_id;
  qString['duration']=format_time(ele.value)['decimal_extended'];
  quick_save_ajax(url, qString);
  $id('edit_times_div_background').setAttribute('refresh', 1);
  edit_times_total();
}
function delete_time(ele) {  var conf=custom_confirm(
    'Are you sure you want to delete this time entry? It cannot be recovered.'
  );
  conf['yes'].setAttribute('time_id', ele.getAttribute('time_id'));
  conf['yes'].setAttribute('task_id', ele.getAttribute('task_id'));
  conf['yes'].setAttribute('user_id', ele.getAttribute('user_id'));
  conf['yes'].onclick=function () {    var url='../time-tracking/save.time-tracking.php';
    var qString=[];
    qString['flag']='delete_time';
    qString['time_id']=this.getAttribute('time_id');
    qString['user_id']=this.getAttribute('user_id');
    qString['task_id']=this.getAttribute('task_id');
    quick_save_ajax(url, qString);
    $id('edit_times_div_background').setAttribute('refresh', 1);
    var tr=$id('time_row_' + this.getAttribute('time_id'));
    tr.parentNode.removeChild(tr);
    this.ondblclick();
    edit_times_total();
  };
}
function build_dropdown(cell, time, id) {  var hours=time.split(':')[0];
  var minutes=time.split(':')[1];
  //HOURS DROP DOWN
  var sel1=$create('SELECT');
  sel1.setAttribute('time_id', id);
  for (var i=0; i < 24; i++) {    var display_hour=i < 10 ? to_two(i) : i;
    //display_hour=(display_hour > 12) ? to_two(display_hour - 12) +" ("+display_hour+")" : display_hour;
    //display_hour=(display_hour == "00") ? "12 (00)" : display_hour;
    var opt=$create('OPTION');
    opt.value=to_two(i);
    opt.appendChild($text(display_hour));
    sel1.appendChild(opt);
  }
  sel1.value=hours;
  cell.appendChild(sel1);
  cell.appendChild($text(':'));
  //MINUTES DROP DOWN
  var sel2=$create('SELECT');
  sel2.setAttribute('time_id', id);
  for (var i=0; i < 60; i++) {    var display_time=i < 10 ? to_two(i) : i;
    var opt=$create('OPTION');
    opt.value=to_two(i);
    opt.appendChild($text(display_time));
    sel2.appendChild(opt);
  }
  sel2.value=minutes;
  cell.appendChild(sel2);
  return [sel1, sel2];
}
function save_time(ele) {  var time_id=ele.getAttribute('time_id');
  var which=ele.id.indexOf('start') > -1 ? 'start' : 'end';
  var the_date=$id(which + '_date_' + time_id).getAttribute('raw_date');
  var hour=$id(which + '_hour_' + time_id).value;
  var minute=$id(which + '_minute_' + time_id).value;
  var save_time=the_date + ' ' + hour + ':' + minute + ':00';
  var url='../time-tracking/save.time-tracking.php';
  qString=[];
  qString['flag']='edit_time';
  qString['which']=tweak_text_for_get(which);
  qString['time_id']=tweak_text_for_get(time_id);
  qString['save_time']=tweak_text_for_get(save_time);
  quick_save_ajax(url, qString);
  if ($id('edit_times_div_background')) {    $id('edit_times_div_background').setAttribute('refresh', 1);
  }
  setTimeout(function () {    gtt.fetch_current();
  }, 2000);
}
var _comment_default='Ask a question or give progress update.';
function switch_view(view, ele) {  if (view == 'weekly') {    window.location='../home/calendar.php';
  } else {    _npo=false;
    _no_date=false;
    //UNHIGHLIGHT OTHER OPTIONS
    var opts=$id('selector').getElementsByTagName('DIV');
    for (i=0; i < opts.length; i++) {      opts[i].className='';
    }
    //HIGHLIGHT THE SELECTED ONE
    ele.className='selected';
    //UPDATE VARIABLES
    _view=view;
    _date=_today;
    //REFRESH DATA
    load_tasks();
    clear_text();
    update_display_date();
  }}
function load_tasks() {  if (_version == 'time-tracking') {    var ajaxRequest; // The variable that makes Ajax possible!
    try {      // Opera 8.0+, Firefox, Safari
      ajaxRequest=new XMLHttpRequest();
    } catch (e) {      // Internet Explorer Browsers
      try {        ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {        try {          ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {          // Something went wrong
          alert('Your browser broke!');
          return false;
        }
      }
    }
    // Create a function that will receive data sent from the server
    ajaxRequest.onreadystatechange=function () {      if (ajaxRequest.readyState != 4) {      } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {        var xml=ajaxRequest.responseXML;
        var tasks=xml.getElementsByTagName('TASK');
        _all_resources=xml
          .getElementsByTagName('ALL_RESOURCES')[0]
          .getElementsByTagName('RESOURCE');
        $id('project_ids').value=getNodeValue(xml, 'ALL_PROJECTS');
        display_time_tracking_tasks(tasks);
        //NOT PUNCHED OUT
        var npo=getNodeValue(xml, 'NOT_PUNCH_OUT');
        var npo_div=$id('not_punched_out');
        if (npo == '0' || npo == '') {          npo_div.className='hidden';
          remove_child_nodes(npo_div);
          //IF ALL TASKS HAVE PUNCH OUT TIMES, BUT WE'RE STILL IN THIS VIEW
          if (_npo == true && tasks.length == 0) {            var div=$create('DIV');
            div.className='block_message clickable';
            div.appendChild(
              $text(
                'All tasks have punch out times associated with them. Click to return to the previous view.'
              )
            );
            div.onclick=function () {              _npo=false;
              load_tasks();
            };
            $id('time_tracking').appendChild(div);
            div.previousSibling.className='hidden';
          }
        } else {          npo_div.className='';
          remove_child_nodes(npo_div);
        }
        //BANNER
        if (_npo == true) {          npo_div.appendChild(
            $text(
              'Viewing tasks without puch out times. Return to Default View.'
            )
          );
          npo_div.onclick=function () {            _npo=false;
            _no_date=false;
            load_tasks();
          };
          npo_div.className='';
        } else {          var npo_text =
            npo == 1
              ? '1 task does not have a punch out time.'
              : npo + ' tasks do not have punch out times.';
          npo_div.appendChild($text(npo_text + ' Click to fix.'));
          npo_div.onclick=function () {            _npo=true;
            _no_date=false;
            load_tasks();
          };
        }
        //TASKS WITHOUT DATE
        if (_no_date == true) {          remove_child_nodes(npo_div);
          npo_div.className='';
          npo_div.appendChild(
            $text('Viewing tasks without due dates. Return to Default View')
          );
          npo_div.onclick=function () {            _npo=false;
            _no_date=false;
            load_tasks();
          };
        }
      } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 0) {        //RE RUN
        load_tasks();
      } else {      }
    };
    var queryString='start=' + tweak_text_for_get(_date);
    queryString += '&view=' + tweak_text_for_get(_view);
    //NOT CLOCKED OUT OVER RIDE
    if (_npo == true) {      queryString='npo=true';
    } else if (_no_date == true) {      queryString='start=no-date';
      queryString += '&view=' + tweak_text_for_get(_view);
    }
    //IF FILTERED TO JUST STARRED TASKS
    if ($id('filter_starred_tasks').checked) {      queryString += '&starred=1';
      localStorage.setItem('filter_starred_tasks', 1);
    } else {      localStorage.setItem('filter_starred_tasks', 0);
    }
    ajaxRequest.open('POST', '../time-tracking/xml.time-tracking.php', true);
    ajaxRequest.setRequestHeader(
      'Content-type',
      'application/x-www-form-urlencoded'
    );
    ajaxRequest.send(queryString);
  }}
function load_tasks_without_dates() {  _npo=false;
  _no_date=true;
  load_tasks();
  document.body.scrollTop=0;
}
function display_time_tracking_tasks(tasks) {  remove_child_nodes($id('time_tracking'));
  var parent=$id('time_tracking');
  parent.className=_view;
  //VARIABLES
  _tasks=[];
  _task_key=[];
  var last_project_id='';
  var last_group_id='';
  var used_groups=[];
  for (var t=0; t < tasks.length; t++) {    var task=tasks[t];
    var task_id=task.getAttribute('id');
    var project_id=task.getAttribute('project_id');
    var sort_order=getNodeValue(task, 'SORT_ORDER');
    if (true) {      //PROJECT NAME
      if (project_id != last_project_id) {        last_project_id=project_id;
        var div=$create('DIV');
        div.className='project_name';
        div.setAttribute('project_id', task.getAttribute('project_id'));
        div.appendChild($text(getNodeValue(task, 'PROJECT_NAME')));
        div.onclick=function () {          window.location =
            '../schedule/?ids=' + this.getAttribute('project_id');
        };
        parent.appendChild(div);
      }
      //GROUP NAME
      if (sort_order != last_group_id) {        last_group_id=sort_order;
        if (true || used_groups[sort_order] == undefined) {          used_groups[sort_order]=sort_order.split('.').length - 2;
          var div=$create('DIV');
          div.className='group_name';
          div.appendChild($text(getNodeValue(task, 'GROUP_NAME')));
          parent.appendChild(div);
          if (used_groups[sort_order] > 0) {            //div.style.marginLeft=adjust_indent(sort_order, used_groups) +"em";
          }
        }
      }
      //DEFINE TASK DATA
      var tlen=_tasks.length;
      _tasks[tlen]=[];
      _tasks[tlen]['task_name']=getNodeValue(task, 'TASK_NAME');
      _tasks[tlen]['project_id']=project_id;
      _tasks[tlen]['user_resources']=[];
      _tasks[tlen]['company_resources']=[];
      _tasks[tlen]['custom_resources']=[];
      _tasks_key[task_id]=tlen;
      //MAIN DIV
      var div=$create('DIV');
      div.className='task_row';
      div.setAttribute('task_id', task_id);
      div.setAttribute('project_id', project_id);
      if (used_groups[sort_order] > 0) {        //div.style.marginLeft=adjust_indent(sort_order, used_groups) +"em";
      }
      parent.appendChild(div);
      //STAR
      var star=$create('DIV');
      star.className='star';
      var star_i=$create('I');
      star_i.className='fa fa-star-o';
      star_i.onclick=function () {        star_task(
          this.parentNode.parentNode.getAttribute('task_id'),
          this.parentNode
        );
      };
      star.appendChild(star_i);
      div.appendChild(star);
      if (task.getAttribute('task_star') == 1) {        star.className += ' starred';
      }
      //PERCENT COMPLETE
      var wrapper=$create('DIV');
      wrapper.className='progress_block';
      div.appendChild(wrapper);
      if (getNodeValue(task, 'TASK_TYPE') == 'task') {        //TASK BAR
        var bar=$create('DIV');
        bar.className='task_in_chart ' + getNodeValue(task, 'COLOR');
        wrapper.appendChild(bar);
        //PERCENT COMPLETE
        var perc=$create('DIV');
        perc.className =
          task.getAttribute('percent_complete') * 1 == 0
            ? 'progress_bar hidden'
            : 'progress_bar';
        perc.style.width=task.getAttribute('percent_complete') + '%';
        perc.id='task_percent_' + task_id;
        bar.appendChild(perc);
        //PROGRESS LINE
        var progress_line=$create('DIV');
        progress_line.className='progress_line';
        progress_line.style.marginLeft =
          task.getAttribute('progress_line') + '%';
        if (task.getAttribute('progress_line') == 100) {          progress_line.style.left='-1px';
        }
        wrapper.appendChild(progress_line);
        var input=$create('INPUT');
        input.id='percent_complete_' + task_id;
        input.className=getNodeValue(task, 'COLOR');
        input.value=task.getAttribute('percent_complete') + '%';
        input.onchange=function () {          update_percent(
            this.parentNode.parentNode.getAttribute('task_id'),
            this.value
          );
        };
        input.onmouseup=function () {          this.select();
        };
        input.setAttribute('read_only', '0');
        if (task.getAttribute('editable') == 0) {          input.setAttribute('readonly', true);
          input.setAttribute('read_only', '1');
        }
        wrapper.appendChild(input);
      } else if (getNodeValue(task, 'TASK_TYPE') == 'milestone') {        //TASK BAR
        var milestone_div=$create('DIV');
        milestone_div.className='milestone_in_chart';
        milestone_div.className +=
          task.getAttribute('percent_complete') == 100 ? ' complete' : '';
        milestone_div.id='percent_complete_' + task_id;
        if (task.getAttribute('editable') == 0) {          milestone_div.onclick=function () {};
        } else {          milestone_div.onclick=function () {            var class_name =
              this.className.indexOf('complete') == -1
                ? 'milestone_in_chart complete'
                : 'milestone_in_chart';
            this.className=class_name;
            var value=this.className.indexOf('complete') > -1 ? 100 : 0;
            update_percent(
              this.parentNode.parentNode.getAttribute('task_id'),
              value
            );
          };
        }
        wrapper.appendChild(milestone_div);
      }
      //MAIN CONTENT
      var main=$create('DIV');
      main.className='task_details';
      div.appendChild(main);
      //TASK NAME
      var task_name=$create('DIV');
      task_name.className='task_name';
      task_name.appendChild($text(getNodeValue(task, 'TASK_NAME')));
      task_name.onclick=function () {        edit_task_info(this.parentNode.parentNode.getAttribute('task_id'), '');
        $id('edit_window').setAttribute('on_close', 'refresh');
      };
      main.appendChild(task_name);
      //BOTTOM DETAILS
      var bottom=$create('DIV');
      bottom.className='task_details_bottom';
      main.appendChild(bottom);
      //DUE TEXT
      var span=$create('SPAN');
      span.className='days_left';
      var days_left=getNodeValue(task, 'DAYS_LEFT');
      span.className += days_left <= 0 ? ' overdue' : '';
      if (days_left == 0) {        days_left='Due Today';
      } else if (days_left == 1) {        days_left='Due Tomorrow';
      } else if (days_left == 'N/A') {        days_left='No Due Date';
        progress_line.className='hidden';
      } else {        days_left += ' days left';
      }
      span.appendChild($text(days_left));
      span.onclick=function () {        edit_task_info(
          this.parentNode.parentNode.parentNode.getAttribute('task_id'),
          'end_date'
        );
        $id('edit_window').setAttribute('on_close', 'refresh');
      };
      bottom.appendChild(span);
      //DOCUMENTS AND COMMENTS
      var documents=task.getElementsByTagName('DOCUMENTS')[0];
      var comments=task.getElementsByTagName('COMMENTS')[0];
      var meta=$create('DIV');
      meta.className='meta';
      bottom.appendChild(meta);
      var docs=$create('DIV');
      docs.id='task_meta_document_' + task_id;
      docs.className='meta_document';
      docs.className += documents.getAttribute('count') > 0 ? ' document' : '';
      docs.className +=
        documents.getAttribute('edit_date') >
        documents.getAttribute('view_date')
          ? ' document_new'
          : '';
      docs.onclick=function () {        load_documents(
          'task',
          this.parentNode.parentNode.parentNode.parentNode.getAttribute(
            'task_id'
          ),
          'document_viewer',
          this
        );
      };
      var i=$create('I');
      i.className='fa fa-paperclip fa-flip-horizontal';
      docs.appendChild(i);
      meta.appendChild(docs);
      var comms=$create('DIV');
      comms.id='task_meta_comment_' + task_id;
      comms.className='meta_comment';
      comms.className += comments.getAttribute('count') > 0 ? ' comment' : '';
      comms.className +=
        comments.getAttribute('edit_date') > comments.getAttribute('view_date')
          ? ' comment_new'
          : '';
      comms.onclick=function () {        load_note(
          'task',
          this.parentNode.parentNode.parentNode.parentNode.getAttribute(
            'task_id'
          ),
          'note_viewer',
          this
        );
      };
      var i=$create('I');
      i.className='fa fa-comment-o';
      comms.appendChild(i);
      var num=comments.getAttribute('count');
      num=num == 0 ? ' ' : num;
      var span=$create('SPAN');
      span.appendChild($text(num));
      comms.appendChild(span);
      meta.appendChild(comms);
      //ASSIGNED RESOURCES
      var user_icons=$create('DIV');
      user_icons.className='user_icons';
      var resources=task
        .getElementsByTagName('RESOURCES')[0]
        .getElementsByTagName('RESOURCE');
      for (var r=0; r < resources.length; r++) {        var img=$create('IMG');
        img.src=getNodeValue(resources[r], 'PIC');
        img.title=getNodeValue(resources[r], 'NAME');
        user_icons.appendChild(img);
        if (getNodeValue(resources[r], 'TYPE') == 'user') {          _tasks[tlen]['user_resources'][
            getNodeValue(resources[r], 'TYPE_ID')
          ]=[];
        }
      }
      main.insertBefore(user_icons, main.firstChild);
      //TIME TRACKING
      if (getNodeValue(task, 'ENABLE_TIME_TRACKING') == 'true') {        user_icons.className += ' time_tracking';
        var time_tracker=$create('DIV');
        time_tracker.className='track_time';
        if (_npo == true) {          time_tracker.className += ' npo';
        }
        div.insertBefore(time_tracker, main);
        var tracking=0;
        var time_id=0;
        var tracked_time='';
        var total_tracked_time=getNodeValue(
          task.getElementsByTagName('TIMES')[0],
          'TOTAL_HOURS'
        );
        var times=task
          .getElementsByTagName('TIMES')[0]
          .getElementsByTagName('TIME');
        var has_time=times.length > 0 ? 2 : 0;
        for (var i=0; i < times.length; i++) {          if (getNodeValue(times[i], 'END') == '') {            tracking=1;
            time_id=times[i].getAttribute('id');
            tracked_time =
              'Tracking since ' + pretty_time(getNodeValue(times[i], 'START'));
            i=times.length * 2;
          } else {            tracking=has_time;
            time_id=0;
            tracked_time='';
          }
        }
        //DISPLAY BUTTONs
        if (tracking == 0 || tracking == 2) {          //NOT TRACKING
          var tracking_div=$create('DIV');
          tracking_div.className='green_button';
          var i=$create('I');
          i.className='fa fa-clock-o';
          tracking_div.appendChild(i);
          tracking_div.appendChild($text(' Track Time'));
          tracking_div.setAttribute('task_id', task_id);
          tracking_div.setAttribute(
            'project_id',
            task.getAttribute('project_id')
          );
          tracking_div.id='track_time_button_' + task_id;
          tracking_div.onclick=function () {            open_tracking_task(this);
          };
          time_tracker.appendChild(tracking_div);
        } else if (tracking == 1) {          //IN PROGRESSS
          var tracking_div=$create('DIV');
          tracking_div.className='red_button';
          var i=$create('I');
          i.className='fa fa-clock-o';
          tracking_div.appendChild(i);
          tracking_div.appendChild($text(' Stop Timer'));
          tracking_div.setAttribute('task_id', task_id);
          tracking_div.setAttribute(
            'project_id',
            task.getAttribute('project_id')
          );
          tracking_div.setAttribute('time_id', time_id);
          tracking_div.id='track_time_button_' + task_id;
          tracking_div.onclick=function () {            save_time_tracking(this, 'end_time');
          };
          time_tracker.appendChild(tracking_div);
          div.setAttribute('tracking', 1);
        }
        //PUNCH BUTTON UNDER TEXT
        var total_time=$create('DIV');
        total_time.className='tracked_time_message';
        total_time.id='tracked_time_message_' + task_id;
        total_time.setAttribute('task_id', task_id);
        total_time.onclick=function () {          $id('track_time_button_' + this.getAttribute('task_id')).click();
        };
        if (tracked_time != '') {          total_time.appendChild($text(tracked_time));
        } else if (total_tracked_time != 0 || tracking == 2) {          total_time.appendChild(
            $text(
              format_time(total_tracked_time)[_time_format] + ' hours today'
            )
          );
        }
        time_tracker.appendChild(total_time);
        if (tracking == 2) {          //TRACKED - TRACK MORE (break from else if loop since it uses the first argument)
          time_tracker.className += ' tracked_time';
        }
        //TRACK MORE TIME
        var track_more=$create('DIV');
        track_more.id='track_more_' + task_id;
        track_more.setAttribute('task_id', task_id);
        track_more.className =
          tracking == 2 ? 'track_more' : 'track_more hidden';
        track_more.appendChild($text('track more time'));
        track_more.onclick=function () {          //this.className="hidden";
          //this.parentNode.className=trim(this.parentNode.className.replace(/tracked_time/g,""));
          if (
            (ele=$id('track_time_button_' + this.getAttribute('task_id')))
          ) {            if (ele.className == 'green_button') {              open_tracking_task(ele);
            }
          }
        };
        time_tracker.appendChild(track_more);
        //EDIT
        var edit=$create('DIV');
        edit.className='grey_button button_small';
        var edit_text=_npo == false ? 'Edit Times' : 'View Times';
        edit.appendChild($text(edit_text));
        edit.onclick=function () {          edit_times(this.parentNode.parentNode.getAttribute('task_id'), this);
        };
        time_tracker.appendChild(edit);
        $id('working_on_something_else').className='';
      }
    }
  }
  //NO TASKS
  if (tasks.length == 0) {    var div=$create('DIV');
    div.className='block_message';
    div.appendChild($text('You have no assigned tasks for the selected date.'));
    div.onclick=function () {      _npo=false;
      load_tasks();
    };
    $id('time_tracking').appendChild(div);
  }}
function join_parts(parts, length) {  var string='';
  for (var p=0; p < length; p++) {    string += parts[p];
    if (p < length - 1) {      string += '.';
    }
  }
  return string;
}
function star_task(task_id, ele) {  var do_star=ele.className.indexOf('starred') > -1 ? 0 : 1;
  ele.className=do_star == 0 ? 'star' : 'star starred';
  save_value('task_star', task_id, do_star);
}
function save_time_tracking(ele, flag) {  var ajaxRequest; // The variable that makes Ajax possible!
  try {    // Opera 8.0+, Firefox, Safari
    ajaxRequest=new XMLHttpRequest();
  } catch (e) {    // Internet Explorer Browsers
    try {      ajaxRequest=new ActiveXObject('Msxml2.XMLHTTP');
    } catch (e) {      try {        ajaxRequest=new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {        // Something went wrong
        alert('Your browser broke!');
        return false;
      }
    }
  }
  // Create a function that will receive data sent from the server
  ajaxRequest.onreadystatechange=function () {    if (ajaxRequest.readyState != 4) {      if (message == 'punched-in') {        ele.className='red_button';
        ele.firstChild.nodeValue=' Stop Timer';
      }
    } else if (ajaxRequest.readyState == 4 && ajaxRequest.status == 200) {      var response=json_decode(ajaxRequest.responseText);
      var task_id=response.task_id;
      var message=response.message;
      var text=response.text;
      var total_time=response.total_time || '0';
      if (total_time != 'null') {        total_time=format_time(total_time)[_time_format];
        if (text != undefined) {          text=text.replace('[total_time]', total_time);
        }
      }
      if (message == 'already-punched-in') {        var conf=custom_alert(
          'You are currently tracking time to another task. Please punch out of that task before tracking any additional time.'
        );
      } else if (_version == 'time-tracking') {        if (flag == 'add_hours') {          //REFRESH TASKS
          load_tasks();
        } else if (message == 'punched-in') {          if (_version == 'time-tracking') {            ele.className='red_button';
            ele.firstChild.nextSibling.nodeValue=' Stop Timer';
            ele.onclick=function () {              save_time_tracking(this, 'end_time');
            };
            ele.setAttribute('time_id', response.time_id);
            ele.parentNode.className='track_time';
            if ($id('tracked_time_message_' + task_id)) {              var e=$id('tracked_time_message_' + task_id);
              remove_child_nodes(e);
              e.appendChild($text(text));
            }
          }
        } else if (message == 'punched-out') {          ele.parentNode.className += ' tracked_time';
          ele.className='green_button';
          ele.onclick=function () {            open_tracking_task(this);
          };
          ele.firstChild.nextSibling.nodeValue=' Track Time';
          ele.removeAttribute('time_id');
          //TRACKING MESSAGE
          if ($id('tracked_time_message_' + task_id)) {            var e=$id('tracked_time_message_' + task_id);
            remove_child_nodes(e);
            e.appendChild($text(text));
          }
          //DISPLAY TRACK MORE
          if ($id('track_more_' + task_id)) {            $id('track_more_' + task_id).className='track_more';
          }
          //PUNCHOUT DETAILS
          if ($id('time_closeout')) {            open_time_closeout(task_id, response);
          }
        }
      }
      if (flag == 'add_hours' || flag == 'punched-out') {        if ($id('category_task_list')) {          //META
          if ((d=$id('track_time_' + task_id) && flag == 'add_hours')) {            d.className += ' has_time';
          }
          _tasks[_tasks_key[task_id]]['actual_hours']=response.total_hours;
          //COLUMN
          if ((d=$id('task_actual_hours_' + task_id))) {            remove_child_nodes(d);
            d.appendChild($text(response.total_hours));
          }
          //BAR
          display_actual_hours_bar(task_id);
          //HIGHLIGHT META ICON IF IT'S THERE
          if ((div=$id('task_meta_' + task_id))) {            var divs=div.getElementsByTagName('DIV');
            for (var d=0; d < divs.length; d++) {              if (divs[d].className.indexOf('meta_time_tracking') > -1) {                divs[d].className += ' has_time';
              }
            }
          }
        }
      }
      if (message == 'punched-in') {        //HIGHLIGHT META ICON IF IT'S THERE
        if ((div=$id('task_meta_' + task_id))) {          var divs=div.getElementsByTagName('DIV');
          for (var d=0; d < divs.length; d++) {            if (divs[d].className.indexOf('meta_time_tracking') > -1) {              divs[d].className += ' has_time punched_in user_punched_in';
            }
          }
        }
      } else if (message == 'punched-out') {      }
      gtt.fetch_current();
    } else {    }
  };
  var queryString =
    'task_id=' + tweak_text_for_get(ele.getAttribute('task_id'));
  queryString +=
    '&project_id=' + tweak_text_for_get(ele.getAttribute('project_id'));
  queryString += '&flag=' + tweak_text_for_get(flag);
  if (flag == 'end_time') {    queryString +=
      '&time_id=' + tweak_text_for_get(ele.getAttribute('time_id'));
  }
  //rewrite querystring
  if (flag == 'add_hours') {    queryString += '&hours=' + tweak_text_for_get($id('punch_in_hours').value);
    queryString += '&dt=' + tweak_text_for_get($id('punch_in_date').value);
    if ($id('new_time_date')) {      $id('new_time_date').value='';
      $id('hours_input').value='';
    }
    $id('punch_in_hours').value='';
    close_tracking();
  }
  ajaxRequest.open('POST', '../time-tracking/save.time-tracking.php', true);
  ajaxRequest.setRequestHeader(
    'Content-type',
    'application/x-www-form-urlencoded'
  );
  ajaxRequest.send(queryString);
}
function open_time_closeout(task_id, response) {  $id('time_closeout').className='';
  $id('time_closeout_background').className='';
  bring_to_front($id('time_closeout'));
  //get field      [time tracking page]                [gantt/list task]                      [gantt/list milestone]
  var perc_input =
    $id('percent_complete_' + task_id) ||
    $id('task_percent_input_' + task_id) ||
    $id('task_percent_input_div_' + task_id);
  var percent_task=$id('closeout_percent_task');
  var percent_milestone=$id('closeout_percent_milestone');
  var task_name=$id('time_closeout_task_name');
  remove_child_nodes(task_name);
  task_name.appendChild($text(_tasks[_tasks_key[task_id]]['task_name']));
  //PUNCHOUT TIME
  $id('time_closeout_time').firstChild.nodeValue=response.end_time;
  $id('time_closeout_time_edit').setAttribute('task_id', task_id);
  $id('time_closeout_time_edit').onclick=function () {    edit_times(this.getAttribute('task_id'), null);
  };
  //PERCENT COMPLETE
  if (perc_input.className.indexOf('milestone') == -1) {    var percent_complete_value =
      perc_input.tagName == 'INPUT'
        ? perc_input.value
        : make_numeric(perc_input.firstChild.textContent) * 1 + '%';
    percent_task.className='value';
    percent_milestone.className='hidden';
    var percent=$id('closeout_percent');
    percent.value=percent_complete_value;
    percent.setAttribute('task_id', task_id);
    percent.onmouseup=function () {      this.select();
    };
    percent.onchange=function () {      var i =
        $id('percent_complete_' + this.getAttribute('task_id')) ||
        $id('task_percent_input_' + this.getAttribute('task_id'));
      if (i.tagName == 'INPUT') {        i.value=this.value;
        i.onchange();
        this.value=i.value;
      } else {        i.firstChild.nodeValue=this.value;
        i.onblur();
        this.value=make_numeric(i.firstChild.textContent) + '%';
      }
    };
    if (perc_input.getAttribute('read_only') == '1') {      percent.disabled=true;
    } else if (
      perc_input.tagName == 'DIV' &&
      perc_input.getAttribute('contenteditable') == false
    ) {      percent.disabled=true;
    } else {      percent.disabled=false;
    }
  } else {    percent_task.className='hidden';
    percent_milestone.className='value';
    var percent_div =
      $id('percent_complete_' + task_id) ||
      $id('task_percent_input_div_' + task_id); // CHECKBOX IN LIST
    var percent=$id('closeout_milestone'); // CHECKBOX IN WINDOW
    percent.className=percent_div.className;
    percent.onclick=function () {      percent_div.click();
      this.className=percent_div.className;
    };
    percent.className +=
      percent_div.className.indexOf('complete') > -1 ? ' complete' : '';
  }
  //COMMENT WINDOW LINK
  if ($id('time_closeout_open_comments')) {    var lnk=$id('time_closeout_open_comments');
    lnk.setAttribute('task_id', task_id);
    lnk.onclick=function () {      $id('time_closeout').className='hidden';
      $id('time_closeout_background').className='hidden';
      var ta=$id('closeout_comment');
      var text=ta.className == 'pre' ? '' : ta.value;
      load_note(
        'task',
        this.getAttribute('task_id'),
        'note_viewer',
        $id('task_meta_comment_' + this.getAttribute('task_id')),
        text
      );
      $id('closeout_comment').value='';
    };
  }
  //COMMENT FIELD
  var comment=$id('closeout_comment');
  comment.value=_comment_default;
  comment.className='pre';
  comment.onfocus=function () {    this.className='';
    if (this.value == _comment_default) {      this.value='';
    }
  };
  comment.onblur=function () {    if (this.value == '') {      this.value=_comment_default;
      this.className='pre';
    }
  };
  comment.setAttribute('target', 'task');
  comment.setAttribute('target_id', task_id);
  comment.setAttribute('message_type', 'comment');
  //USERS
  var target=$id('closeout_send_email_alert');
  remove_child_nodes(target);
  var table=$create('TABLE');
  table.setAttribute('cellpadding', 0);
  table.setAttribute('cellspacing', 0);
  table.setAttribute('border', 0);
  table.setAttribute('width', '100%');
  target.appendChild(table);
  if (response && response.task_id == task_id) {    var users=response.users;
    if (typeof users == 'object') {      for (var u=0; u < users.length; u++) {        if (u % 3 == 0) {          var row_len=table.rows.length;
          var row=table.insertRow(row_len);
        }
        var cell_len=row.cells.length;
        var cell=row.insertCell(cell_len);
        cell.style.width='33.33%';
        var label=$create('LABEL');
        cell.appendChild(label);
        var input=$create('INPUT');
        input.type='checkbox';
        input.value=users[u].id;
        input.checked=users[u].checked == 1 ? true : false;
        label.appendChild(input);
        label.appendChild($text(' ' + users[u].name));
      }
    }
  }
  //SUBMIT BUTTON
  $id('closeout_submit').disabled=false;
  $id('closeout_submit').value='Done';
  $id('closeout_submit').onclick=function () {    if ($id('closeout_comment').value != _comment_default) {      var body={        message: $id('closeout_comment').value,
      };
      var url =
        pluralize_target($id('closeout_comment').getAttribute('target')) +
        '/' +
        $id('closeout_comment').getAttribute('target_id') +
        '/comments';
      new $ajax({        type: 'POST',
        url: API_URL + 'v1/' + url,
        data: body,
        response: function (data) {          //
        },
      });
    }
    $id('time_closeout').className='hidden';
    $id('time_closeout_background').className='hidden';
  };
}
function update_percent(task_id, percent_complete) {  var ele=$id('percent_complete_' + task_id);
  if (ele && ele.className.indexOf('milestone') > -1) {    //do nothing
    perc_complete=percent_complete;
  } else if (ele) {    var perc_complete=make_numeric(percent_complete);
    perc_complete=perc_complete < 0 ? 0 : perc_complete;
    perc_complete=perc_complete > 100 ? 100 : perc_complete;
    ele.value=perc_complete + '%';
    //UPDATE PROGREESS
    var progress=$id('task_percent_' + task_id);
    if (progress) {      progress.className =
        perc_complete > 0 ? 'progress_bar' : 'progress_bar hidden';
      progress.style.width=perc_complete + '%';
    }
    ele.blur();
  }
  save_value('percent_complete', task_id, perc_complete);
}
////////////// CONTEXT MENU ///////////////////////////////////
function right_click_menu(ele) {  ele.title='';
  ele.removeAttribute('title');
  var menu=$create('DIV');
  menu.id='right_click_menu';
  document.body.appendChild(menu);
  var top=_page_mouseY;
  var left=_page_mouseX;
  if (_version && _version == 'list_view') {    left -= 150;
  }
  setTimeout(clear_text, 20);
  setTimeout(function() {    right_click_cover('set');
  }, 20);
  if (ele.className.indexOf('quick_add_control') == 0) {    //FOR QUICK ADD ARROW
    var type=ele.getAttribute('type');
    var type_id=ele.getAttribute('type_id');
  } else {    //FOR ELEMENT
    var type =
      ele.className.indexOf('category') > -1 ||
      ele.className.indexOf('group') > -1
        ? 'group'
        : 'task';
    var type_id=ele.parentNode.getAttribute(type + '_id');
  }
  menu.setAttribute('type', type);
  menu.setAttribute('type_id', type_id);
  menu.onmouseover=function() {    highlight_row(
      this.getAttribute('type'),
      this.getAttribute('type_id'),
      'hover_on'
    );
  };
  menu.className='right_click_menu';
  menu.style.top=top + 'px';
  menu.style.left=left + 'px';
  //SEE IF IT WILL FIT
  var sizes=page_sizes();
  var height=sizes[1];
  height += get_scrolltop();
  //HEIGHT CORRECTION
  var menu_height=menu.offsetHeight;
  var diff=height - (menu_height * 1 + top) - 10;
  if (diff < 0) {    top += diff;
    left += 15;
    menu.style.top=top + 'px';
    menu.style.left=left + 'px';
  }
  //WIDTH CORRECTION
  var diff=sizes[0] * 1 - (left * 1 + menu.offsetWidth * 1 + 25);
  if (diff <= 0) {    menu.style.marginLeft=diff + 'px';
  }
  delay_highlight(type, type_id, 'hover_on');
  var send_type_id=type == 'group' ? type_id + ':-1' : type_id;
  // ADD TASK
  menu.appendChild(
    make_option('Insert Task Below', type, send_type_id, function() {      quick_add(
        'task',
        this.getAttribute('type'),
        this.getAttribute('type_id')
      );
      right_click_cover('hide');
      track_segment_event('gantt-added-a-task-from-right-click-menu');
    })
  );
  // ADD MILESTONE
  menu.appendChild(
    make_option('Insert Milestone Below', type, send_type_id, function() {      quick_add(
        'milestone',
        this.getAttribute('type'),
        this.getAttribute('type_id')
      );
      track_segment_event('gantt-added-a-milestone-from-right-click-menu');
    })
  );
  // ADD GROUP
  var group_id =
    type == 'group' ? type_id : _tasks[_tasks_key[type_id]]['group_id'];
  menu.appendChild(
    make_option('Insert Group Below', type, group_id, function() {      quick_add_group(this.getAttribute('type_id'));
      track_segment_event('gantt-added-a-group-from-right-click-menu');
    })
  );
  if (type === 'task') {    menu.appendChild(make_divider());
    //CONVERT
    menu.appendChild(
      make_option('Convert to SubGroup', type, type_id, function() {        save_value(
          'convert_task_to_subtask',
          this.getAttribute('type'),
          this.getAttribute('type_id')
        );
        track_segment_event('gantt-converted-to-subgroup-from-right-click-menu');
      })
    );
    //CONVERT TASK TYPE (TASK ONLY)
    var task_type=_tasks[_tasks_key[type_id]]['task_type'].toLowerCase();
    var convert_text =
      task_type === 'task' ? 'Convert to Milestone' : 'Convert To Task';
    menu.appendChild(
      make_option(convert_text, task_type, type_id, function() {        var value=this.getAttribute('type') == 'task' ? 'Milestone' : 'Task';
        save_value(
          'convert_task_milestone',
          this.getAttribute('type_id'),
          value
        );
        if(task_type === 'task') {          track_segment_event('gantt-converted-task-to-milestone-from-right-click-menu');
        } else if(task_type === 'milestone') {          track_segment_event('gantt-converted-milestone-to-task-from-right-click-menu');
        }
      })
    );
  }
  //OUTDENT
  var group;
  if (type === 'task') {    var group =
      _groups[_groups_key[_tasks[_tasks_key[type_id]]['group_id']]][
        'parent_group_id'
      ];
  } else if (type === 'group') {    var group=_groups[_groups_key[type_id]]['parent_group_id'];
  }
  if (group !== '') {    menu.appendChild(
      make_option('Outdent', type, type_id, function() {        save_value(
          'outdent',
          this.getAttribute('type'),
          this.getAttribute('type_id')
        );
        track_segment_event('gantt-outdented-a-'+type+'-from-right-click-menu');
      })
    );
  }
  menu.appendChild(make_divider());
  //DUPLICATE
  menu.appendChild(
    make_option(
      'Duplicate',
      type,
      type_id,
      function() {        display_loading(null);
        duplicate_item(this.getAttribute('type'), this.getAttribute('type_id'));
        track_segment_event('gantt-duplicated-a-'+this.getAttribute('type')+'-from-right-click-menu');
      },
      'right_click_menu__option__muted'
    )
  );
  //EDIT
  menu.appendChild(
    make_option(
      'Edit',
      type,
      type_id,
      function() {        var type_id=this.getAttribute('type_id');
        if (this.getAttribute('type') === 'task') {          edit_task_info(type_id);
          track_segment_event('gantt-opened-edit-task-from-right-click-menu');
        } else {          edit_group_info(type_id);
          track_segment_event('gantt-opened-edit-group-from-right-click-menu');
        }
      },
      'right_click_menu__option__muted'
    )
  );
  //DELETE
  menu.appendChild(
    make_option(
      'Delete',
      type,
      type_id,
      function() {        var type=this.getAttribute('type');
        var type_id=this.getAttribute('type_id');
        if (type == 'task') {          var conf=custom_confirm(
            'Are you sure you want to delete "' +
              _tasks[_tasks_key[type_id]]['task_name'] +
              '"?'
          );
          conf['yes'].setAttribute('type_id', type_id);
          conf['yes'].onclick=function() {            this.ondblclick();
            save_value('remove_task', type_id, -1);
            track_segment_event('gantt-deleted-a-task-from-right-click-menu');
          };
        } else if (type == 'group') {          check_delete_group(type_id, 'gantt-deleted-a-group-from-right-click-menu');
        }
      },
      'right_click_menu__option__delete'
    )
  );
}
function right_click_cover(direction) {  if (direction == 'set') {    var cover=$create('DIV');
    cover.id='right_click_cover';
    cover.onclick=function() {      right_click_cover('hide');
    };
    document.body.appendChild(cover);
  } else {    document.body.removeChild($id('right_click_menu'));
    document.body.removeChild($id('right_click_cover'));
    unhighlight_all('', '');
  }}
function make_option(text, type, type_id, onclick, className) {  var option=$create('DIV');
  option.className='right_click_menu__option';
  if (className) {    option.className += ' ' + className;
  }
  option.innerText=text;
  option.setAttribute('type', type);
  option.setAttribute('type_id', type_id);
  option.onclick=function() {    onclick.call(this);
    right_click_cover('hide');
  };
  return option;
}
function make_divider() {  var divider=$create('DIV');
  divider.className='right_click_menu__divider';
  return divider;
}
function duplicate_item(type, type_id) {  var isValid=type === 'task' || type === 'group';
  if (!isValid) {    return;
  }
  new $ajax({    parent: this,
    type: 'POST',
    url: API_URL + 'v1/' + type + 's/' + type_id + '/duplicate',
    response: function() {      load_gantt();
    },
  });
}