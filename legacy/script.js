// ============================================
// STATE MANAGEMENT
// ============================================
const DEFAULT_DATA = {
  projects: [],
  parcels: [],
  workflows: [],
  compensations: [],
  fieldTasks: [],
  grievances: [],
  documents: [],
  disputes: [],
  alerts: [],
  users: [
    {id:'admin',role:'Admin',name:'System Administrator',type:'gov'},
    {id:'officer1',role:'District Officer',name:'District Collector',type:'gov'},
    {id:'officer2',role:'Land Acquisition Officer',name:'LAO Mumbai',type:'gov'},
    {id:'field1',role:'Field Officer',name:'Field Surveyor',type:'gov'},
    {id:'user1',role:'Citizen',name:'Ramesh Kumar',type:'public',email:'user@example.com',password:'user123'}
  ],
  notifications: [],
  auditLog: []
};

const INDIAN_STATES_UTS = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana',
  'Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur',
  'Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi',
  'Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'
];

// ============================================
// GIS REFERENCE DATA (land/acquisition + logistics context)
// ============================================
const GIS_CATEGORIES = {
  govOffice: { label: 'Government Offices', icon: '🏛️', color: '#204d40', defaultOn: true,
    points: [
      { name: 'Pune District Collector Office', lat: 18.5246, lng: 73.8786, address: 'Pune, Maharashtra' },
      { name: 'Bengaluru Rural DC Office, Devanahalli', lat: 13.2437, lng: 77.7128, address: 'Devanahalli, Bengaluru Rural, Karnataka' },
      { name: 'Chennai Collectorate', lat: 13.0827, lng: 80.2707, address: 'Chennai, Tamil Nadu' },
      { name: 'Mantralaya (State Secretariat), Mumbai', lat: 18.9281, lng: 72.8238, address: 'Mumbai, Maharashtra' },
      { name: 'Ministry of Rural Development, New Delhi', lat: 28.6139, lng: 77.2090, address: 'New Delhi, Delhi' },
      { name: 'Telangana Secretariat, Hyderabad', lat: 17.4060, lng: 78.4736, address: 'Hyderabad, Telangana' },
      { name: 'Kolkata District Magistrate Office', lat: 22.5726, lng: 88.3639, address: 'Kolkata, West Bengal' },
      { name: 'Gujarat Sachivalaya, Gandhinagar', lat: 23.2237, lng: 72.6369, address: 'Gandhinagar, Gujarat' },
      { name: 'Rajasthan Secretariat, Jaipur', lat: 26.9124, lng: 75.7873, address: 'Jaipur, Rajasthan' },
      { name: 'UP Secretariat (Bapu Bhawan), Lucknow', lat: 26.8467, lng: 80.9462, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  govHospital: { label: 'Government Hospitals', icon: '🏥', color: '#1e40af', defaultOn: true,
    points: [
      { name: 'Sassoon General Hospital, Pune', lat: 18.5308, lng: 73.8654, address: 'Pune, Maharashtra' },
      { name: 'Victoria Hospital, Bengaluru', lat: 12.9629, lng: 77.5775, address: 'Bengaluru, Karnataka' },
      { name: 'Rajiv Gandhi Govt. General Hospital, Chennai', lat: 13.0842, lng: 80.2760, address: 'Chennai, Tamil Nadu' },
      { name: 'KEM Hospital, Mumbai', lat: 19.0016, lng: 72.8413, address: 'Mumbai, Maharashtra' },
      { name: 'AIIMS New Delhi', lat: 28.5672, lng: 77.2100, address: 'New Delhi, Delhi' },
      { name: 'Gandhi Hospital, Hyderabad', lat: 17.4239, lng: 78.4867, address: 'Hyderabad, Telangana' },
      { name: 'SSKM Hospital, Kolkata', lat: 22.5390, lng: 88.3430, address: 'Kolkata, West Bengal' },
      { name: 'Civil Hospital, Ahmedabad', lat: 23.0480, lng: 72.5714, address: 'Ahmedabad, Gujarat' },
      { name: 'SMS Hospital, Jaipur', lat: 26.9096, lng: 75.8100, address: 'Jaipur, Rajasthan' },
      { name: 'King George Medical University, Lucknow', lat: 26.8683, lng: 80.9231, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  privateHospital: { label: 'Private Hospitals', icon: '🏨', color: '#7c3aed', defaultOn: false,
    points: [
      { name: 'Ruby Hall Clinic, Pune', lat: 18.5304, lng: 73.8783, address: 'Pune, Maharashtra' },
      { name: 'Manipal Hospital, Bengaluru', lat: 12.9600, lng: 77.6484, address: 'Bengaluru, Karnataka' },
      { name: 'Apollo Hospitals, Chennai', lat: 13.0604, lng: 80.2496, address: 'Chennai, Tamil Nadu' },
      { name: 'Lilavati Hospital, Mumbai', lat: 19.0509, lng: 72.8295, address: 'Mumbai, Maharashtra' },
      { name: 'Max Super Speciality Hospital, Saket, Delhi', lat: 28.5273, lng: 77.2101, address: 'New Delhi, Delhi' },
      { name: 'Apollo Hospitals, Jubilee Hills, Hyderabad', lat: 17.4239, lng: 78.4083, address: 'Hyderabad, Telangana' },
      { name: 'AMRI Hospitals, Dhakuria, Kolkata', lat: 22.5093, lng: 88.3672, address: 'Kolkata, West Bengal' },
      { name: 'Sterling Hospital, Ahmedabad', lat: 23.0304, lng: 72.5245, address: 'Ahmedabad, Gujarat' },
      { name: 'Fortis Escorts Hospital, Jaipur', lat: 26.8570, lng: 75.8050, address: 'Jaipur, Rajasthan' },
      { name: 'Sahara Hospital, Lucknow', lat: 26.8890, lng: 81.0090, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  railway: { label: 'Railway Stations', icon: '🚉', color: '#a4402b', defaultOn: true,
    points: [
      { name: 'Pune Junction', lat: 18.5286, lng: 73.8744, address: 'Pune, Maharashtra' },
      { name: 'KSR Bengaluru City Junction', lat: 12.9767, lng: 77.5713, address: 'Bengaluru, Karnataka' },
      { name: 'Chennai Central', lat: 13.0827, lng: 80.2750, address: 'Chennai, Tamil Nadu' },
      { name: 'Chhatrapati Shivaji Maharaj Terminus, Mumbai', lat: 18.9398, lng: 72.8355, address: 'Mumbai, Maharashtra' },
      { name: 'New Delhi Railway Station', lat: 28.6431, lng: 77.2197, address: 'New Delhi, Delhi' },
      { name: 'Secunderabad Junction', lat: 17.4344, lng: 78.5013, address: 'Hyderabad, Telangana' },
      { name: 'Howrah Junction', lat: 22.5839, lng: 88.3428, address: 'Kolkata, West Bengal' },
      { name: 'Ahmedabad Junction (Kalupur)', lat: 23.0258, lng: 72.6011, address: 'Ahmedabad, Gujarat' },
      { name: 'Jaipur Junction', lat: 26.9196, lng: 75.7877, address: 'Jaipur, Rajasthan' },
      { name: 'Lucknow Charbagh Railway Station', lat: 26.8302, lng: 80.9210, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  airport: { label: 'Airports', icon: '✈️', color: '#0891b2', defaultOn: true,
    points: [
      { name: 'Pune Airport', lat: 18.5822, lng: 73.9197, address: 'Pune, Maharashtra' },
      { name: 'Kempegowda International Airport, Bengaluru', lat: 13.1986, lng: 77.7066, address: 'Bengaluru, Karnataka' },
      { name: 'Chennai International Airport', lat: 12.9941, lng: 80.1709, address: 'Chennai, Tamil Nadu' },
      { name: 'Chhatrapati Shivaji Maharaj Intl. Airport, Mumbai', lat: 19.0896, lng: 72.8656, address: 'Mumbai, Maharashtra' },
      { name: 'Indira Gandhi International Airport, Delhi', lat: 28.5562, lng: 77.1000, address: 'New Delhi, Delhi' },
      { name: 'Rajiv Gandhi International Airport, Hyderabad', lat: 17.2403, lng: 78.4294, address: 'Hyderabad, Telangana' },
      { name: 'Netaji Subhas Chandra Bose Intl. Airport, Kolkata', lat: 22.6547, lng: 88.4467, address: 'Kolkata, West Bengal' },
      { name: 'Sardar Vallabhbhai Patel Intl. Airport, Ahmedabad', lat: 23.0772, lng: 72.6347, address: 'Ahmedabad, Gujarat' },
      { name: 'Jaipur International Airport', lat: 26.8242, lng: 75.8122, address: 'Jaipur, Rajasthan' },
      { name: 'Chaudhary Charan Singh Intl. Airport, Lucknow', lat: 26.7606, lng: 80.8893, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  petrolPump: { label: 'Petrol Pumps', icon: '⛽', color: '#dc2626', defaultOn: false,
    points: [
      { name: 'HPCL Petrol Pump, Nagar Road', lat: 18.5560, lng: 73.9010, address: 'Pune, Maharashtra' },
      { name: 'IOCL Petrol Pump, Outer Ring Road', lat: 12.9350, lng: 77.6940, address: 'Bengaluru, Karnataka' },
      { name: 'BPCL Petrol Pump, Anna Salai', lat: 13.0480, lng: 80.2500, address: 'Chennai, Tamil Nadu' },
      { name: 'HPCL Petrol Pump, Western Express Highway', lat: 19.1190, lng: 72.8470, address: 'Mumbai, Maharashtra' },
      { name: 'IOCL Petrol Pump, Ring Road', lat: 28.5730, lng: 77.2100, address: 'New Delhi, Delhi' },
      { name: 'BPCL Petrol Pump, Hitech City Road', lat: 17.4430, lng: 78.3800, address: 'Hyderabad, Telangana' },
      { name: 'HPCL Petrol Pump, EM Bypass', lat: 22.5150, lng: 88.3980, address: 'Kolkata, West Bengal' },
      { name: 'IOCL Petrol Pump, SG Highway', lat: 23.0350, lng: 72.5100, address: 'Ahmedabad, Gujarat' },
      { name: 'BPCL Petrol Pump, Tonk Road', lat: 26.8600, lng: 75.8100, address: 'Jaipur, Rajasthan' },
      { name: 'HPCL Petrol Pump, Kanpur Road', lat: 26.7950, lng: 80.9200, address: 'Lucknow, Uttar Pradesh' }
    ]
  },
  infra: { label: 'Other Public Infrastructure', icon: '🏗️', color: '#b6802f', defaultOn: false,
    points: [
      { name: 'Pune Metro Depot, Range Hills', lat: 18.5679, lng: 73.8419, address: 'Pune, Maharashtra' },
      { name: 'Devanahalli Industrial Area', lat: 13.2437, lng: 77.7325, address: 'Devanahalli, Karnataka' },
      { name: 'Tambaram Bus Terminus, Chennai', lat: 12.9249, lng: 80.1000, address: 'Chennai, Tamil Nadu' },
      { name: 'Kashmere Gate ISBT, Delhi', lat: 28.6667, lng: 77.2280, address: 'New Delhi, Delhi' },
      { name: 'HITEC City, Hyderabad', lat: 17.4483, lng: 78.3915, address: 'Hyderabad, Telangana' },
      { name: 'GIFT City, Gandhinagar', lat: 23.1610, lng: 72.6851, address: 'Gandhinagar, Gujarat' },
      { name: 'Sitapura Industrial Area, Jaipur', lat: 26.7550, lng: 75.8380, address: 'Jaipur, Rajasthan' },
      { name: 'Amausi Industrial Area, Lucknow', lat: 26.7770, lng: 80.8890, address: 'Lucknow, Uttar Pradesh' }
    ]
  }
};
const GIS_HIGHWAYS = [
  { name: 'Mumbai–Pune Expressway (NE 4)', points: [[18.9281,72.8238],[18.75,73.15],[18.5679,73.7397],[18.5246,73.8786]] },
  { name: 'Bengaluru–Chennai Corridor (NH 48 / NH 44)', points: [[13.0827,80.2707],[12.95,79.4],[13.267,77.715]] }
];

let data = JSON.parse(localStorage.getItem('bhoomiSetuData')) || JSON.parse(JSON.stringify(DEFAULT_DATA));
let currentView = 'dashboard';
let currentUser = null;
let map = null;
let mapLayerGroups = {};
let markers = [];
let charts = {};
let reportCharts = {};
let modalCharts = {};
let modalChartTimeout = null;
let autoRefreshInterval = null;
let currentLocationMarker = null;
let pmapCurrentLocationMarker = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================
function uid(prefix='ID'){return prefix+'-'+Date.now()+'-'+Math.random().toString(36).substr(2,6);}
function fmtINR(n){return '₹'+n.toLocaleString('en-IN');}
function fmtCr(n){return (n/10000000).toFixed(2);}
function fmtDate(d){return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'});}
function fmtDateTime(d){return new Date(d).toLocaleString('en-IN');}
function daysSince(d){return Math.floor((new Date()-new Date(d))/(1000*60*60*24));}
function stageOf(s){return s.replace(/([A-Z])/g,' $1').trim();}
function parcelById(id){return data.parcels.find(p=>p.id===id);}
function projectById(id){return data.projects.find(p=>p.id===id);}
function canEdit(){return currentUser && ['Admin','District Officer','Land Acquisition Officer'].includes(currentUser.role);}
function canViewAll(){return currentUser && ['Admin','District Officer'].includes(currentUser.role);}
function isGov(){return !!(currentUser && currentUser.type==='gov');}
function isPublic(){return !!(currentUser && currentUser.type==='public');}
function esc(s){return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function logAudit(action,detail){
  data.auditLog.push({
    id:uid('AUD'),
    user:currentUser.name,
    role:currentUser.role,
    action,
    detail,
    timestamp:new Date().toISOString()
  });
  saveData();
}
function toast(msg,type='info'){
  const wrap=document.getElementById('toastWrap');
  const el=document.createElement('div');
  const icons={info:'ℹ️',success:'✅',error:'❌',warning:'⚠️'};
  el.className='toast '+(type||'info');
  el.innerHTML=`<span class="toast-icon">${icons[type]||'ℹ️'}</span> ${msg}`;
  wrap.appendChild(el);
  setTimeout(()=>{el.style.animation='toastOut .4s ease forwards';setTimeout(()=>el.remove(),400);},3000);
}

// ============================================
// COMPENSATION CALCULATOR (RFCTLARR 2013)
// ============================================
function computeCompensation(area,marketValue,locationType,landType){
  const baseValue = area * marketValue;
  const solatium = baseValue * 1.0; // 100% solatium
  const ruralMultiplier = locationType === 'Rural' ? baseValue * 2.0 : 0;
  const assetValue = ['Commercial','Industrial'].includes(landType) ? baseValue * 0.3 : 0;
  const totalCompensation = baseValue + solatium + ruralMultiplier + assetValue;
  return {baseValue,solatium,ruralMultiplier,assetValue,totalCompensation};
}

// ============================================
// LOGIN SYSTEM (dual Government / Public access)
// ============================================
const GOV_ONLY_VIEWS = ['workflows','compensation','fieldTasks','reports','alerts','disputes','dashboardAdmin'];

function switchTab(tab){
  document.querySelectorAll('.login-tab').forEach(t=>t.classList.remove('active'));
  if(tab==='government'){
    document.getElementById('tabGov').classList.add('active');
    document.getElementById('govLoginForm').classList.remove('hidden-form');
    document.getElementById('publicLoginForm').classList.add('hidden-form');
  } else {
    document.getElementById('tabPublic').classList.add('active');
    document.getElementById('govLoginForm').classList.add('hidden-form');
    document.getElementById('publicLoginForm').classList.remove('hidden-form');
  }
}

function loginGovernment(){
  const id = document.getElementById('govId').value.trim();
  const password = document.getElementById('govPassword').value.trim();
  const key = document.getElementById('govKey').value.trim().toUpperCase();

  if(!id || !password || !key){
    toast('⚠️ Please fill all fields: ID, Password, and Special Key', 'error');
    return;
  }
  const keyPattern = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  if(!keyPattern.test(key)){
    toast('⚠️ Invalid Special Key format. Use: XXXX-XXXX-XXXX-XXXX', 'error');
    return;
  }

  const validGov = {
    'LAO-2024-001': { password:'admin123', key:'ABCD-1234-EFGH-5678', userId:'admin' },
    'DO-2024-001':  { password:'do123',    key:'DCBA-4321-HGFE-8765', userId:'officer1' },
    'LAO-2024-002': { password:'lao123',   key:'EFGH-5678-IJKL-9012', userId:'officer2' },
    'FLD-2024-001': { password:'field123', key:'IJKL-9012-MNOP-3456', userId:'field1' }
  };

  const match = validGov[id];
  if(match && match.password===password && match.key===key){
    const user = data.users.find(u=>u.id===match.userId);
    currentUser = user;
    toast('✅ Government login successful! Welcome ' + currentUser.name, 'success');
    enterApp();
  } else {
    toast('❌ Login failed. Please check your credentials.', 'error');
  }
}

function loginPublic(){
  const email = document.getElementById('publicEmail').value.trim();
  const password = document.getElementById('publicPassword').value.trim();

  if(!email || !password){
    toast('⚠️ Please enter email and password', 'error');
    return;
  }
  const loginId = email.toLowerCase();
  const registeredUser = data.users.find(u=>u.type==='public' && (((u.email||'').toLowerCase()===loginId) || u.mobile===email) && u.password===password);
  if(registeredUser){
    currentUser = registeredUser;
    toast('✅ Public login successful! Welcome ' + currentUser.name, 'success');
    enterApp();
  } else {
    toast('❌ Login failed. Please check your credentials or register.', 'error');
  }
}

function requestPasswordReset(){
  const email = (document.getElementById('publicEmail')?.value || '').trim();
  if(!email || !email.includes('@')){
    toast('⚠️ Enter your registered email above first, then click Forgot Password', 'warning');
    return;
  }
  toast('Password reset email is not configured in this frontend prototype. No email was sent.', 'warning');
}

function openRegisterModal(){
  document.getElementById('modalTitle').textContent = '📝 Register — Public Account';
  document.getElementById('modalBody').innerHTML = `
    <form id="registerForm" onsubmit="return false;">
      <div class="form-grid">
        <div class="form-group">
          <label class="label">Full Name <span class="required">*</span></label>
          <input class="form-input" id="regName" placeholder="e.g., Ramesh Kumar">
        </div>
        <div class="form-group">
          <label class="label">Mobile Number <span class="required">*</span></label>
          <input class="form-input" id="regMobile" placeholder="10-digit mobile number" maxlength="10">
        </div>
        <div class="form-group">
          <label class="label">Email Address <span class="required">*</span></label>
          <input class="form-input" id="regEmail" type="email" placeholder="your@email.com">
        </div>
        <div class="form-group">
          <label class="label">State <span class="required">*</span></label>
          <select class="form-select" id="regState">
            <option value="">Select State/UT</option>
            ${INDIAN_STATES_UTS.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="label">Password <span class="required">*</span></label>
          <input class="form-input" id="regPassword" type="password" placeholder="Min. 6 characters">
        </div>
        <div class="form-group">
          <label class="label">Confirm Password <span class="required">*</span></label>
          <input class="form-input" id="regPasswordConfirm" type="password" placeholder="Re-enter password">
        </div>
      </div>
      <div id="regError" style="color:var(--brick);font-size:12px;margin-top:12px;"></div>
      <div style="margin-top:10px;font-size:11px;color:var(--text-faint);">Prototype verification: this frontend does not send real SMS OTPs. Account data is stored in this browser only.</div>
    </form>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="submitRegistration()">✅ Create Account</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function submitRegistration(){
  const name = document.getElementById('regName').value.trim();
  const mobile = document.getElementById('regMobile').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const state = document.getElementById('regState').value;
  const password = document.getElementById('regPassword').value;
  const passwordConfirm = document.getElementById('regPasswordConfirm').value;
  const errorEl = document.getElementById('regError');

  if(!name || !mobile || !email || !state || !password || !passwordConfirm){
    errorEl.textContent = '⚠️ Please fill in all required fields.';
    return;
  }
  if(!/^[0-9]{10}$/.test(mobile)){
    errorEl.textContent = '⚠️ Enter a valid 10-digit mobile number.';
    return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errorEl.textContent = '⚠️ Enter a valid email address.';
    return;
  }
  if(password.length < 6){
    errorEl.textContent = '⚠️ Password must be at least 6 characters.';
    return;
  }
  if(password !== passwordConfirm){
    errorEl.textContent = '⚠️ Passwords do not match.';
    return;
  }
  const normalizedEmail = email.toLowerCase();
  if(data.users.some(u => (u.email||'').toLowerCase()===normalizedEmail || (u.mobile||'')===mobile)){
    errorEl.textContent = '⚠️ An account with this email or mobile number already exists.';
    return;
  }

  const newUser = { id:'pub-'+Date.now(), role:'Citizen', name, mobile, email:normalizedEmail, state, password, type:'public', verified:true };
  data.users.push(newUser);
  saveData();
  closeModal();
  toast('✅ Account created! You can now log in.', 'success');
  document.getElementById('publicEmail').value = email;
  document.getElementById('publicPassword').value = '';
}

function enterApp(){
  logAudit('Login', `${currentUser.name} (${currentUser.role}) logged in`);
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('app').classList.add('active');

  document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('userName').textContent = currentUser.name;
  document.getElementById('userRole').textContent = currentUser.role;

  const badge = document.getElementById('userBadge');
  if(isGov()){
    badge.textContent = '🏛️ Govt';
    badge.className = 'badge-role gov';
  } else {
    badge.textContent = '👤 Public';
    badge.className = 'badge-role public';
  }

  currentView = 'dashboard';
  render();
  toast('🚀 Welcome to BhoomiSetu!', 'success');
}

function logout(){
  if(confirm('Are you sure you want to logout?')){
    logAudit('Logout', `${currentUser.name} (${currentUser.role}) logged out`);
    saveData();
    currentUser = null;
    document.getElementById('app').classList.remove('active');
    document.getElementById('loginScreen').classList.remove('hidden');
    const govId=document.getElementById('govId'), govPw=document.getElementById('govPassword'), govKey=document.getElementById('govKey');
    const pubEmail=document.getElementById('publicEmail'), pubPw=document.getElementById('publicPassword');
    if(govId) govId.value=''; if(govPw) govPw.value=''; if(govKey) govKey.value='';
    if(pubEmail) pubEmail.value=''; if(pubPw) pubPw.value='';
    toast('👋 Logged out successfully', 'info');
  }
}

// Enter key support for login
document.addEventListener('keypress', function(e){
  if(e.key==='Enter' && document.getElementById('loginScreen') && !document.getElementById('loginScreen').classList.contains('hidden')){
    const govVisible = !document.getElementById('govLoginForm').classList.contains('hidden-form');
    if(govVisible) loginGovernment(); else loginPublic();
  }
});

// ============================================
// NAVIGATION
// ============================================
function toggleSidebar(){
  document.getElementById('sidebar').classList.toggle('mobile-open');
  document.getElementById('sidebarBackdrop').classList.toggle('active');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarBackdrop').classList.remove('active');
}

// Escape key closes whichever popup/modal is currently open, so a stuck
// finger/mouse on a small close button is never the only way out.
document.addEventListener('keydown', function(e){
  if(e.key !== 'Escape') return;
  const pmapOverlay = document.getElementById('pmapOverlay');
  if(pmapOverlay && pmapOverlay.classList.contains('active')){ closeProjectMapPopup(); return; }
  const modalOverlay = document.getElementById('modalOverlay');
  if(modalOverlay && modalOverlay.classList.contains('active')){ closeModal(); }
});

function setView(view){
  if(isPublic() && GOV_ONLY_VIEWS.includes(view)){
    toast('🔒 This section is restricted to government staff.', 'error');
    view = 'dashboard';
  }
  currentView = view;
  document.querySelectorAll('.nav-item').forEach(el=>el.classList.toggle('active',el.dataset.view===view));
  renderContent(view);
  afterRender(view);
  closeSidebar();
}

function toggleNotif(){
  const count = data.notifications.filter(n=>!n.read).length;
  toast(`You have ${count} new notifications`, count>0?'warning':'info');
}

// ============================================
// DATA PERSISTENCE
// ============================================
function saveData(){
  // Recalculate data-driven alerts before persisting so generated alerts survive refresh.
  generateAlerts();
  try {
    localStorage.setItem('bhoomiSetuData',JSON.stringify(data));
    return true;
  } catch(err) {
    console.error('BhoomiSetu storage error:', err);
    toast('Browser storage is full. Large uploaded files may need to be removed before saving more data.', 'error');
    return false;
  }
}

function generateAlerts(){
  const newAlerts = [];
  
  // Check for stalled proceedings (>90 days)
  const stalled = data.workflows.filter(w => w.daysPending > 90);
  stalled.forEach(w => {
    if(!data.alerts.some(a=>a.type==='Stalled Proceeding' && a.parcelId===w.parcelId)) {
      newAlerts.push({
        id:uid('ALT'),
        type:'Stalled Proceeding',
        message:`Parcel ${w.parcelId} pending for ${w.daysPending} days`,
        severity:'high',
        acknowledged:false,
        date:new Date().toISOString(),
        parcelId:w.parcelId
      });
    }
  });

  // Check for high-risk parcels
  data.parcels.filter(p=>p.riskScore>80).forEach(p => {
    if(!data.alerts.some(a=>a.type==='High Risk Parcel' && a.parcelId===p.id)) {
      newAlerts.push({
        id:uid('ALT'),
        type:'High Risk Parcel',
        message:`Parcel ${p.id} has risk score ${p.riskScore}`,
        severity:'high',
        acknowledged:false,
        date:new Date().toISOString(),
        parcelId:p.id
      });
    }
  });

  // Check for overdue field tasks
  data.fieldTasks.filter(t=>t.status==='Overdue').forEach(t => {
    if(!data.alerts.some(a=>a.type==='Overdue Task' && a.parcelId===t.parcelId)) {
      newAlerts.push({
        id:uid('ALT'),
        type:'Overdue Task',
        message:`Task ${t.id} overdue for ${t.location}`,
        severity:'medium',
        acknowledged:false,
        date:new Date().toISOString(),
        parcelId:t.parcelId
      });
    }
  });

  data.alerts = [...data.alerts, ...newAlerts];
}

// ============================================
// RENDER ENGINE
// ============================================
function render(){
  if(!currentUser) return;
  saveData();
  renderNav();
  updateTopbar();
  document.getElementById('notifBadge').textContent = data.notifications.filter(n=>!n.read).length;
  renderContent(currentView);
  afterRender(currentView);
  const npBtn = document.getElementById('newProjectBtn');
  if(npBtn) npBtn.style.display = canEdit() ? 'inline-flex' : 'none';
}

function renderNav(){
  const nav = document.getElementById('nav');
  let sections;

  if(isGov()){
    sections = [
      {id:'overview',title:'OVERVIEW',items:[
        {id:'dashboard',label:'Dashboard',icon:'📊'},
        {id:'map',label:'GIS Map View',icon:'🗺️'},
        {id:'timeline',label:'National Timeline',icon:'⏳'}
      ]},
      {id:'land',title:'LAND RECORDS',items:[
        {id:'parcels',label:'Parcel Registry',icon:'📋'},
        {id:'workflows',label:'Acquisition Workflow',icon:'🔄'}
      ]},
      {id:'disbursement',title:'DISBURSEMENT',items:[
        {id:'compensation',label:'Compensation & Payout',icon:'💰'}
      ]},
      {id:'field',title:'FIELD / PUBLIC INTERFACE',items:[
        {id:'fieldTasks',label:'Field Operations',icon:'👷'},
        {id:'grievances',label:'Grievance Redressal',icon:'⚠️'},
        {id:'documents',label:'Document Vault',icon:'📁'}
      ]},
      {id:'governance',title:'GOVERNANCE',items:[
        {id:'reports',label:'Reports & Analytics',icon:'📈'},
        {id:'ai',label:'AI Intelligence',icon:'🤖'},
        {id:'alerts',label:'Alerts',icon:'🔔'},
        {id:'projects',label:'Projects',icon:'🏗️'},
        {id:'disputes',label:'Dispute Management',icon:'⚖️'},
        {id:'dashboardAdmin',label:'Admin Dashboard',icon:'🛡️'}
      ]}
    ];
  } else {
    // Public / Citizen nav - limited, read-oriented access
    sections = [
      {id:'overview',title:'OVERVIEW',items:[
        {id:'dashboard',label:'Public Dashboard',icon:'📊'},
        {id:'map',label:'GIS Map View',icon:'🗺️'},
        {id:'timeline',label:'National Timeline',icon:'⏳'}
      ]},
      {id:'info',title:'INFORMATION',items:[
        {id:'parcels',label:'Parcel Info',icon:'📋'},
        {id:'projects',label:'Projects',icon:'🏗️'}
      ]},
      {id:'services',title:'CITIZEN SERVICES',items:[
        {id:'grievances',label:'File Grievance',icon:'⚠️'},
        {id:'documents',label:'Documents',icon:'📁'},
        {id:'ai',label:'AI Assistant',icon:'🤖'}
      ]}
    ];
  }

  nav.innerHTML = sections.map(s => `
    <div class="nav-section">
      <div class="nav-section-title">${s.title}</div>
      ${s.items.map(i => `
        <div class="nav-item ${i.id===currentView?'active':''}" data-view="${i.id}" onclick="setView('${i.id}')">
          <span class="nav-icon">${i.icon}</span>
          <span>${i.label}</span>
          ${getBadgeCount(i.id)}
        </div>
      `).join('')}
    </div>
  `).join('');
}

function getBadgeCount(viewId){
  const counts = {
    alerts: data.alerts.filter(a=>!a.acknowledged).length,
    grievances: data.grievances.filter(g=>g.status==='Open').length,
    fieldTasks: data.fieldTasks.filter(t=>t.status==='Overdue').length,
    disputes: data.disputes.filter(d=>d.status!=='Resolved').length
  };
  const count = counts[viewId] || 0;
  return count > 0 ? `<span class="nav-badge">${count}</span>` : '';
}

function updateTopbar(){
  const titles = {
    dashboard:'Dashboard',
    map:'GIS Map View',
    timeline:'National Timeline',
    parcels:'Parcel Registry',
    workflows:'Acquisition Workflow',
    compensation:'Compensation & Payout',
    fieldTasks:'Field Operations',
    grievances:'Grievance Redressal',
    documents:'Document Vault',
    reports:'Reports & Analytics',
    ai:'AI Intelligence',
    alerts:'Alerts',
    projects:'Projects',
    disputes:'Dispute Management',
    dashboardAdmin:'Admin Dashboard'
  };
  const subs = {
    dashboard:'National Overview Dashboard',
    map:'Interactive Land Parcel Map',
    timeline:'Project Timeline & Milestones',
    parcels:'Complete Parcel Registry',
    workflows:'Track Acquisition Proceedings',
    compensation:'Manage Compensation Disbursement',
    fieldTasks:'Field Verification Tasks',
    grievances:'Public Grievance Management',
    documents:'Document Repository',
    reports:'Analytics & Reporting',
    ai:'AI-Powered Risk Analysis',
    alerts:'Critical Notifications',
    projects:'Project Management',
    disputes:'Legal Dispute Tracking',
    dashboardAdmin:'System Administration'
  };
  document.getElementById('topbarTitle').textContent = titles[currentView] || 'Dashboard';
  document.getElementById('topbarSub').textContent = subs[currentView] || 'National Land Acquisition System';
}

function renderContent(view){
  const main = document.getElementById('main');
  const viewMap = {
    dashboard: viewDashboard,
    map: viewMapPage,
    timeline: viewTimeline,
    parcels: viewParcels,
    workflows: viewWorkflows,
    compensation: viewCompensation,
    fieldTasks: viewFieldTasks,
    grievances: viewGrievances,
    documents: viewDocuments,
    reports: viewReports,
    ai: viewAI,
    alerts: viewAlerts,
    projects: viewProjects,
    disputes: viewDisputes,
    dashboardAdmin: viewAdminDashboard
  };
  main.innerHTML = (viewMap[view] || viewDashboard)();
}

function afterRender(view){
  const afterMap = {
    dashboard: initDashboardCharts,
    map: () => setTimeout(initMap,100),
    timeline: initTimeline,
    reports: initReportCharts,
    ai: initAICharts,
    dashboardAdmin: initAdminCharts
  };
  if(afterMap[view]) afterMap[view]();
}

// ============================================
// VIEW: DASHBOARD (Enhanced)
// ============================================
function viewDashboard(){
  const totalParcels = data.parcels.length;
  const totalArea = data.parcels.reduce((sum,p)=>sum+p.area,0);
  const totalSanctioned = data.compensations.reduce((sum,c)=>sum+c.sanctionedAmount,0);
  const totalDisbursed = data.compensations.reduce((sum,c)=>sum+c.disbursedAmount,0);
  const pendingComp = data.compensations.reduce((sum,c)=>sum+c.pendingAmount,0);
  const openGrievances = data.grievances.filter(g=>g.status==='Open').length;
  const activeProjects = data.projects.filter(p=>p.status==='Active').length;
  const highRiskParcels = data.parcels.filter(p=>p.riskScore>70).length;
  const completionRate = totalParcels > 0 ? (data.parcels.filter(p=>p.acquisitionStage==='Completed').length/totalParcels*100) : 0;
  const pendingTasks = data.fieldTasks.filter(t=>t.status==='Pending').length;
  const openDisputes = data.disputes.filter(d=>d.status!=='Resolved').length;

  return `
    <div class="section-header">
      <div>
        <h2>📊 National Overview Dashboard</h2>
        <p class="subtitle">Real-time land acquisition statistics across India · ${new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</p>
      </div>
      <div class="actions">
        <button class="btn btn-sm btn-secondary" onclick="refreshData()">🔄 Refresh</button>
        <button class="btn btn-sm btn-secondary" onclick="exportPDF()">📄 Export PDF</button>
      </div>
    </div>

    <div class="quick-stats">
      <div class="stat-chip"><div class="stat-number">${activeProjects}</div><div class="stat-label">Active Projects</div></div>
      <div class="stat-chip"><div class="stat-number">${totalParcels}</div><div class="stat-label">Total Parcels</div></div>
      <div class="stat-chip"><div class="stat-number">${completionRate.toFixed(0)}%</div><div class="stat-label">Completion Rate</div></div>
      <div class="stat-chip"><div class="stat-number">${openGrievances}</div><div class="stat-label">Open Grievances</div></div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon">📐</div>
        <div class="kpi-label">Total Land Area</div>
        <div class="kpi-value">${totalArea.toFixed(2)} acres</div>
        <div class="kpi-change up">↑ 8.5% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💰</div>
        <div class="kpi-label">Compensation Sanctioned</div>
        <div class="kpi-value">₹${fmtCr(totalSanctioned)} Cr</div>
        <div class="kpi-change up">↑ 15% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">💵</div>
        <div class="kpi-label">Compensation Disbursed</div>
        <div class="kpi-value">₹${fmtCr(totalDisbursed)} Cr</div>
        <div class="kpi-change up">↑ 18% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⏳</div>
        <div class="kpi-label">Pending Compensation</div>
        <div class="kpi-value">₹${fmtCr(pendingComp)} Cr</div>
        <div class="kpi-change down">↓ 5% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⚠️</div>
        <div class="kpi-label">Open Grievances</div>
        <div class="kpi-value">${openGrievances}</div>
        <div class="kpi-change down">↓ 3% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">🔴</div>
        <div class="kpi-label">High-Risk Parcels</div>
        <div class="kpi-value">${highRiskParcels}</div>
        <div class="kpi-change down">↓ 2% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">📋</div>
        <div class="kpi-label">Pending Tasks</div>
        <div class="kpi-value">${pendingTasks}</div>
        <div class="kpi-change up">↑ 4% from last month</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⚖️</div>
        <div class="kpi-label">Open Disputes</div>
        <div class="kpi-value">${openDisputes}</div>
        <div class="kpi-change down">↓ 1% from last month</div>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">Land Type Distribution</div>
        <div class="chart-container"><canvas id="landTypeChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Acquisition Pipeline</div>
        <div class="chart-container"><canvas id="acquisitionPipelineChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">State-wise Acquisition Activity</div>
        <div class="chart-container"><canvas id="stateWiseChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Compensation Status Distribution</div>
        <div class="chart-container"><canvas id="compensationStatusChart"></canvas></div>
      </div>
    </div>

    <div class="section-header" style="margin-top:30px;">
      <h2>⚠️ Attention Required</h2>
    </div>
    <div class="attention-grid">
      ${getAttentionCards()}
    </div>
  `;
}

function getAttentionCards(){
  const stalled = data.workflows.filter(w=>w.daysPending>90);
  const delayed = data.compensations.filter(c=>c.paymentStatus==='Pending');
  const pendingDocs = data.documents.filter(d=>d.verificationStatus==='Pending');
  const highRisk = data.parcels.filter(p=>p.riskScore>70);
  const overdueTasks = data.fieldTasks.filter(t=>t.status==='Overdue');
  const openDisputes = data.disputes.filter(d=>d.status!=='Resolved');

  return [
    {title:'Stalled Proceedings', count:stalled.length, items:stalled.slice(0,5).map(w=>({label:w.parcelId, sub:w.daysPending+' days', action:`viewParcelDetail('${esc(w.parcelId)}')`})), type:'danger'},
    {title:'Delayed Compensation', count:delayed.length, items:delayed.slice(0,5).map(c=>({label:c.parcelId, sub:'₹'+fmtCr(c.pendingAmount)+' Cr', action:`viewParcelDetail('${esc(c.parcelId)}')`})), type:'warning'},
    {title:'Pending Verification', count:pendingDocs.length, items:pendingDocs.slice(0,5).map(d=>({label:d.id, sub:d.type, action:''})), type:'info'},
    {title:'High-Risk Parcels', count:highRisk.length, items:highRisk.slice(0,5).map(p=>({label:p.id, sub:'Risk: '+p.riskScore, action:`viewParcelDetail('${esc(p.id)}')`})), type:'danger'},
    {title:'Overdue Tasks', count:overdueTasks.length, items:overdueTasks.slice(0,5).map(t=>({label:t.id, sub:t.type, action:''})), type:'warning'},
    {title:'Open Disputes', count:openDisputes.length, items:openDisputes.slice(0,5).map(d=>({label:d.id, sub:d.category, action:`resolveDispute('${esc(d.id)}')`})), type:'danger'}
  ].map(card => `
    <div class="attention-card ${card.type==='warning'?'warning':card.type==='info'?'info':card.type==='success'?'success':''}">
      <div class="attention-title">
        ${card.title}
        <span class="attention-count">${card.count}</span>
      </div>
      <ul class="attention-items">
        ${card.items.map(item => `
          <li class="attention-item" ${item.action ? `onclick="${item.action}"` : ''}>
            <span>${esc(item.label)}</span>
            <span class="item-tag badge ${card.type==='danger'?'badge-danger':card.type==='warning'?'badge-warning':'badge-info'}">${esc(item.sub)}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function refreshData(){
  try {
    const saved = localStorage.getItem('bhoomiSetuData');
    if(saved){
      const parsed = JSON.parse(saved);
      data = {...DEFAULT_DATA, ...parsed};
    }
    render();
    toast('Data refreshed from browser storage.','success');
  } catch(err) {
    console.error(err);
    toast('Unable to refresh data safely.','error');
  }
}

function exportPDF(){
  // Browser print is the honest frontend-only PDF path: the user can choose "Save as PDF".
  toast('Print dialog opened — choose “Save as PDF” to create the report.','info');
  setTimeout(() => window.print(), 120);
}

function initDashboardCharts(){
  // Land Type Distribution
  const landTypeDist = {};
  data.parcels.forEach(p=>{landTypeDist[p.landType]=(landTypeDist[p.landType]||0)+1;});
  if(charts.landType) charts.landType.destroy();
  charts.landType = new Chart(document.getElementById('landTypeChart'),{
    type:'doughnut',
    data:{labels:Object.keys(landTypeDist), datasets:[{data:Object.values(landTypeDist), backgroundColor:['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

  // Acquisition Pipeline
  const stageDist = {};
  data.parcels.forEach(p=>{stageDist[p.acquisitionStage]=(stageDist[p.acquisitionStage]||0)+1;});
  if(charts.pipeline) charts.pipeline.destroy();
  charts.pipeline = new Chart(document.getElementById('acquisitionPipelineChart'),{
    type:'bar',
    data:{labels:Object.keys(stageDist).map(s=>stageOf(s)), datasets:[{label:'Parcels', data:Object.values(stageDist), backgroundColor:'#3b82f6'}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  // State-wise Distribution
  const stateDist = {};
  data.parcels.forEach(p=>{stateDist[p.state]=(stateDist[p.state]||0)+1;});
  if(charts.state) charts.state.destroy();
  charts.state = new Chart(document.getElementById('stateWiseChart'),{
    type:'bar',
    data:{labels:Object.keys(stateDist), datasets:[{label:'Parcels', data:Object.values(stateDist), backgroundColor:'#10b981'}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  // Compensation Status
  const compStatus = {Paid:0, Pending:0, Partial:0};
  data.compensations.forEach(c=>{compStatus[c.paymentStatus]=(compStatus[c.paymentStatus]||0)+1;});
  if(charts.comp) charts.comp.destroy();
  charts.comp = new Chart(document.getElementById('compensationStatusChart'),{
    type:'doughnut',
    data:{labels:Object.keys(compStatus), datasets:[{data:Object.values(compStatus), backgroundColor:['#10b981','#f59e0b','#ef4444']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });
}

// ============================================
// VIEW: TIMELINE
// ============================================
function viewTimeline(){
  const allEvents = [];
  
  // Project events
  data.projects.forEach(p => {
    allEvents.push({date:p.startDate, title:`Project Started: ${p.name}`, desc:`${p.agency} - ${p.district}, ${p.state}`, type:'project'});
  });

  // Notification events
  data.parcels.forEach(p => {
    allEvents.push({date:p.notificationDate, title:`Notification Issued: ${p.id}`, desc:`${p.village}, ${p.tehsil}`, type:'notification'});
  });

  // Compensation events
  data.compensations.filter(c=>c.paymentStatus==='Paid').forEach(c => {
    allEvents.push({date:c.date, title:`Compensation Paid: ${c.parcelId}`, desc:`₹${fmtCr(c.sanctionedAmount)} Cr`, type:'compensation'});
  });

  // Sort by date descending
  allEvents.sort((a,b) => new Date(b.date) - new Date(a.date));

  return `
    <div class="section-header">
      <h2>⏳ National Timeline</h2>
      <p class="subtitle">Chronological view of all land acquisition events and milestones</p>
      <div class="actions">
        <button class="btn btn-sm btn-secondary" onclick="filterTimeline('all')">All</button>
        <button class="btn btn-sm btn-secondary" onclick="filterTimeline('project')">Projects</button>
        <button class="btn btn-sm btn-secondary" onclick="filterTimeline('notification')">Notifications</button>
        <button class="btn btn-sm btn-secondary" onclick="filterTimeline('compensation')">Compensation</button>
      </div>
    </div>

    <div class="card">
      <div class="timeline" id="timelineContainer">
        ${allEvents.slice(0,20).map(e => `
          <div class="timeline-item ${e.type==='project'?'completed':e.type==='notification'?'active':''}">
            <div class="tl-date">${fmtDate(e.date)}</div>
            <div class="tl-title">${esc(e.title)}</div>
            <div class="tl-desc">${esc(e.desc)}</div>
            <span class="badge ${e.type==='project'?'badge-success':e.type==='notification'?'badge-info':'badge-warning'}">${e.type}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function filterTimeline(type){
  // Simplified filter - could be enhanced
  document.querySelectorAll('.timeline-item').forEach(el => {
    if(type==='all') el.style.display = 'block';
    else {
      const hasType = el.querySelector('.badge')?.textContent === type;
      el.style.display = hasType ? 'block' : 'none';
    }
  });
  toast(`Showing ${type} events`,'info');
}

function initTimeline(){}

// ============================================
// VIEW: MAP (Enhanced)
// ============================================
function viewMapPage(){
  const categories = [
    { key: 'parcels', icon: '📍', label: 'Land Parcels / Projects' },
    { key: 'govOffice', icon: '🏛️', label: 'Government Offices' },
    { key: 'govHospital', icon: '🏥', label: 'Govt. Hospitals' },
    { key: 'privateHospital', icon: '🏨', label: 'Private Hospitals' },
    { key: 'railway', icon: '🚉', label: 'Railway Stations' },
    { key: 'airport', icon: '✈️', label: 'Airports' },
    { key: 'infra', icon: '🏗️', label: 'Other Infrastructure' },
    { key: 'highway', icon: '🛣️', label: 'Roads / Highways' }
  ];
  return `
    <div class="section-header">
      <div>
        <h2>🗺️ GIS Map View ${isGov() ? '· Staff' : '· Public'}</h2>
        <p class="subtitle">${isGov() ? 'Land parcels, acquisition offices and logistics/accessibility layers for staff planning' : 'Public view of project locations and nearby public infrastructure'}</p>
      </div>
    </div>

    <div class="map-controls">
      <button class="btn btn-sm btn-secondary" onclick="toggleMapLayer('road')">🗺️ Road Map</button>
      <button class="btn btn-sm btn-secondary" onclick="toggleMapLayer('satellite')">🛰️ Satellite</button>
      <button class="btn btn-sm btn-secondary" onclick="zoomToIndia()">🇮🇳 India View</button>
      <button class="btn btn-sm btn-secondary" onclick="getCurrentLocation()">📍 Current Location</button>
      <button class="btn btn-sm btn-secondary" onclick="showAllParcels()">📌 All Parcels</button>
      <input type="text" class="search-input" placeholder="Search location..." id="location-search">
      <button class="btn btn-sm btn-primary" onclick="searchLocation()">🔍 Search</button>
    </div>

    <div class="map-legend" id="mapLegend">
      ${categories.map(c => `
        <label class="map-legend-item">
          <input type="checkbox" checked onchange="toggleMapCategory('${c.key}', this)">
          <span>${c.icon} ${c.label}</span>
        </label>
      `).join('')}
    </div>

    <div id="map"></div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:16px;">
      <div class="card" style="padding:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#10b981;"></span>
          <span>Acquired (${data.parcels.filter(p=>p.acquisitionStage==='Completed'||p.acquisitionStage==='PossessionTaken').length})</span>
        </div>
      </div>
      <div class="card" style="padding:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#f59e0b;"></span>
          <span>In Progress (${data.parcels.filter(p=>p.acquisitionStage!=='Completed'&&p.acquisitionStage!=='PossessionTaken').length})</span>
        </div>
      </div>
      ${isGov() ? `
      <div class="card" style="padding:12px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:#ef4444;"></span>
          <span>High Risk (${data.parcels.filter(p=>p.riskScore>70).length})</span>
        </div>
      </div>` : ''}
    </div>
  `;
}

function initMap(){
  if(map) map.remove();
  markers = [];
  mapLayerGroups = {};

  map = L.map('map').setView([20.5937,78.9629],5);

  const roadLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OpenStreetMap'}).addTo(map);
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'ESRI'});

  map.satelliteLayer = satelliteLayer;
  map.roadLayer = roadLayer;

  // Land parcel markers (color-coded by risk/stage)
  const parcelGroup = L.layerGroup();
  data.parcels.forEach(p => {
    if(p.lat && p.lng){
      const color = p.riskScore>70 ? '#ef4444' : p.riskScore>40 ? '#f59e0b' : '#10b981';
      const icon = L.divIcon({
        html: `<div style="background:${color};width:12px;height:12px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);"></div>`,
        iconSize:[12,12],
        className:''
      });
      const marker = L.marker([p.lat,p.lng], {icon}).bindPopup(`
        <div style="min-width:200px;">
          <strong style="font-size:15px;">${esc(p.id)}</strong><br>
          <b>Survey:</b> ${esc(p.surveyNo)}<br>
          <b>Location:</b> ${esc(p.village)}, ${esc(p.tehsil)}<br>
          <b>State:</b> ${esc(p.state)}<br>
          <b>Area:</b> ${p.area.toFixed(2)} acres<br>
          <b>Type:</b> ${esc(p.landType)}<br>
          <b>Stage:</b> ${esc(stageOf(p.acquisitionStage))}
          ${isGov() ? `<br><b>Risk:</b> ${p.riskScore}` : ''}
          <hr style="margin:6px 0;">
          <button class="btn btn-sm" onclick="viewParcelDetail('${esc(p.id)}')">View Details</button>
        </div>
      `);
      parcelGroup.addLayer(marker);
      markers.push(marker);
    }
  });

  // Project markers: use the project's own lat/lng if it was set when the
  // project was created; otherwise fall back to the centroid of its linked
  // parcels so older/legacy projects (with no lat/lng of their own) still show up.
  data.projects.forEach(p => {
    const projectParcels = data.parcels.filter(parcel => parcel.projectId === p.id);
    let centerLat, centerLng, isExactLocation;
    if(p.lat!=null && p.lng!=null && !isNaN(p.lat) && !isNaN(p.lng)){
      centerLat = p.lat;
      centerLng = p.lng;
      isExactLocation = true;
    } else if(projectParcels.length > 0) {
      centerLat = projectParcels.reduce((s,parcel)=>s+parcel.lat,0)/projectParcels.length;
      centerLng = projectParcels.reduce((s,parcel)=>s+parcel.lng,0)/projectParcels.length;
      isExactLocation = false;
    }
    if(centerLat!=null && centerLng!=null && !isNaN(centerLat) && !isNaN(centerLng)) {
      const icon = L.divIcon({
        html: `<div style="background:#b6802f;width:16px;height:16px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:8px;color:white;font-weight:bold;">P</div>`,
        iconSize:[16,16],
        className:''
      });
      const marker = L.marker([centerLat, centerLng], {icon}).bindPopup(`
        <div style="min-width:200px;">
          <strong style="font-size:15px;">${esc(p.name)}</strong><br>
          <b>Agency:</b> ${esc(p.agency)}<br>
          <b>State:</b> ${esc(p.state)}<br>
          <b>Status:</b> ${esc(p.status)}<br>
          <b>Parcels:</b> ${projectParcels.length}<br>
          <span style="font-size:11px;color:#888;">${isExactLocation ? '📍 Exact project location' : '📍 Estimated from linked parcels'}</span>
        </div>
      `);
      parcelGroup.addLayer(marker);
      markers.push(marker);
    }
  });
  parcelGroup.addTo(map);
  mapLayerGroups.parcels = parcelGroup;

  // Reference infrastructure categories (govt offices, hospitals, railways, airports, etc.)
  Object.entries(GIS_CATEGORIES).forEach(([key, cat]) => {
    const group = L.layerGroup();
    cat.points.forEach(pt => {
      const icon = L.divIcon({
        html: `<div style="background:${cat.color};width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);"><span style="transform:rotate(-45deg);font-size:12px;">${cat.icon}</span></div>`,
        iconSize: [26, 26], iconAnchor: [13, 26], className: ''
      });
      const m = L.marker([pt.lat, pt.lng], { icon }).bindPopup(`
        <div style="min-width:200px;">
          <strong style="font-size:14px;">${cat.icon} ${esc(pt.name)}</strong><br>
          <span style="color:#6b7280;font-size:12px;">${esc(cat.label)}</span><br>
          ${pt.address ? `<span style="font-size:12.5px;">${esc(pt.address)}</span><br>` : ''}
          <a href="https://www.google.com/maps/search/?api=1&query=${pt.lat},${pt.lng}" target="_blank" rel="noopener" class="btn btn-sm" style="margin-top:6px;display:inline-block;">🌐 View on Google Maps</a>
        </div>
      `);
      group.addLayer(m);
    });
    if(cat.defaultOn) group.addTo(map);
    mapLayerGroups[key] = group;
  });

  // Highways / corridors connecting project regions
  const highwayGroup = L.layerGroup();
  GIS_HIGHWAYS.forEach(h => {
    const line = L.polyline(h.points, { color: '#3f7a95', weight: 4, opacity: 0.8, dashArray: '8,6' }).bindPopup(`<strong>🛣️ ${esc(h.name)}</strong>`);
    highwayGroup.addLayer(line);
  });
  highwayGroup.addTo(map);
  mapLayerGroups.highway = highwayGroup;

  // Sync legend checkboxes with each category's default-on state
  Object.values(GIS_CATEGORIES).forEach(cat => {
    if(!cat.defaultOn){
      document.querySelectorAll('#mapLegend .map-legend-item').forEach(item => {
        if(item.textContent.includes(cat.label)) item.querySelector('input').checked = false;
      });
    }
  });
}

function toggleMapCategory(key, checkbox){
  if(!map || !mapLayerGroups[key]) return;
  if(checkbox.checked){ mapLayerGroups[key].addTo(map); }
  else { map.removeLayer(mapLayerGroups[key]); }
}

function toggleMapLayer(type){
  if(!map) return;
  if(type==='satellite'){
    if(map.hasLayer(map.roadLayer)) map.removeLayer(map.roadLayer);
    if(!map.hasLayer(map.satelliteLayer)) map.satelliteLayer.addTo(map);
  } else {
    if(map.hasLayer(map.satelliteLayer)) map.removeLayer(map.satelliteLayer);
    if(!map.hasLayer(map.roadLayer)) map.roadLayer.addTo(map);
  }
  toast(`Switched to ${type} view`,'info');
}

function zoomToIndia(){ if(map) map.setView([20.5937,78.9629],5); }
function getCurrentLocation(){
  if(!map){ toast('Map is not ready yet. Please try again.', 'warning'); return; }
  if(!navigator.geolocation){ toast('Geolocation is not supported by this browser.', 'error'); return; }
  toast('Requesting your current location…', 'info');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = Number(pos.coords.latitude), lng = Number(pos.coords.longitude);
    if(!Number.isFinite(lat) || !Number.isFinite(lng)) { toast('Browser returned an invalid location.', 'error'); return; }
    map.setView([lat,lng],14);
    if(currentLocationMarker) map.removeLayer(currentLocationMarker);
    currentLocationMarker = L.marker([lat,lng], {title:'Your current location'}).bindPopup('<strong>📍 Your Current Location</strong>').addTo(map);
    currentLocationMarker.openPopup();
  }, err => {
    const msg = err && err.code === 1 ? 'Location permission was denied. Please allow location access in your browser.' :
      err && err.code === 2 ? 'Your current location is unavailable right now.' :
      err && err.code === 3 ? 'Location request timed out. Please try again.' : 'Unable to get your current location.';
    toast(msg, 'error');
  }, {enableHighAccuracy:true, timeout:10000, maximumAge:30000});
}
function showAllParcels(){
  if(map && markers.length) map.fitBounds(markers.map(m=>m.getLatLng()));
  toast('Showing all parcels','info');
}
async function searchLocation(){
  const input = document.getElementById('location-search');
  const query = input?.value.trim();
  if(!query){ toast('Enter a location to search.', 'warning'); return; }
  if(!map){ toast('Map is not ready yet. Please try again.', 'warning'); return; }
  if(input) input.disabled = true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&accept-language=en&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {headers:{'Accept':'application/json'}, signal:controller.signal});
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const results = await response.json();
    if(!Array.isArray(results) || !results.length) { toast('Location not found in India.', 'error'); return; }
    const first = results[0];
    const lat = Number(first.lat), lon = Number(first.lon);
    if(!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Invalid geocoder coordinates');
    map.setView([lat,lon],14);
    if(currentLocationMarker) map.removeLayer(currentLocationMarker);
    currentLocationMarker = L.marker([lat,lon], {title:first.display_name || query}).bindPopup(`<strong>🔎 ${esc(query)}</strong><br><span style="font-size:12px;">${esc(first.display_name || 'India')}</span>`).addTo(map);
    currentLocationMarker.openPopup();
  } catch(err) {
    if(err.name === 'AbortError') toast('Location search timed out. Please try again.', 'error');
    else { console.error('BhoomiSetu geocoding error:', err); toast('Search service is temporarily unavailable. Please try again.', 'error'); }
  } finally {
    clearTimeout(timer);
    if(input) input.disabled = false;
  }
}

// ============================================
// PROJECT MAP POPUP (New Project page)
// ============================================
let pmapMap = null;
let pmapLayerGroups = {};
let pmapMarkers = [];
let pmapInitTimer = null;
let pmapInvalidateTimer = null;
let pmapPickMode = false;
let pmapPickMarker = null;
let pmapPickedLat = null;
let pmapPickedLng = null;

function openProjectMapPopup(pickMode){
  pmapPickMode = !!pickMode;
  pmapPickedLat = null;
  pmapPickedLng = null;
  document.getElementById('pmapOverlay').classList.add('active');
  const details = document.getElementById('pmapDetails');
  details.style.display = 'none';
  details.innerHTML = '';
  const hint = document.getElementById('pmapPickHint');
  if(hint) hint.style.display = pmapPickMode ? 'block' : 'none';
  const legend = document.getElementById('pmapLegend');
  legend.innerHTML = Object.entries(GIS_CATEGORIES).map(([key,cat]) => `
    <label class="map-legend-item">
      <input type="checkbox" checked onchange="pmapToggleCategory('${key}', this)">
      <span>${cat.icon} ${esc(cat.label)}</span>
    </label>
  `).join('');
  // Cancel any pending init/resize from a previous open so a fast
  // close-then-reopen can never leave two timers racing each other.
  if(pmapInitTimer) { clearTimeout(pmapInitTimer); pmapInitTimer = null; }
  if(pmapInvalidateTimer) { clearTimeout(pmapInvalidateTimer); pmapInvalidateTimer = null; }
  // Leaflet cannot measure a hidden/zero-size container correctly, which is what
  // caused the popup to freeze/lock up. Wait a tick for the popup to become
  // visible and sized before creating the map, then invalidateSize() once more.
  pmapInitTimer = setTimeout(initProjectMapPopup, 60);
}

function closeProjectMapPopup(){
  document.getElementById('pmapOverlay').classList.remove('active');
  // Cancel any init/resize still waiting to fire so it can't create or
  // resize a map after the popup is already gone.
  if(pmapInitTimer) { clearTimeout(pmapInitTimer); pmapInitTimer = null; }
  if(pmapInvalidateTimer) { clearTimeout(pmapInvalidateTimer); pmapInvalidateTimer = null; }
  if(pmapCurrentLocationMarker){ pmapCurrentLocationMarker = null; }
  if(pmapMap){ pmapMap.remove(); pmapMap = null; }
  pmapLayerGroups = {};
  pmapMarkers = [];
  pmapPickMode = false;
  pmapPickMarker = null;
}

function initProjectMapPopup(){
  // Popup may have been closed before this delayed call fired - bail out
  // rather than building a map inside a hidden container.
  if(!document.getElementById('pmapOverlay').classList.contains('active')) return;
  if(!document.getElementById('pmapMap')) return;
  if(pmapMap){ pmapMap.remove(); pmapMap = null; }
  pmapLayerGroups = {};
  pmapMarkers = [];

  pmapMap = L.map('pmapMap', { scrollWheelZoom:true }).setView([20.5937,78.9629],5);

  const roadLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'OpenStreetMap'}).addTo(pmapMap);
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{attribution:'ESRI'});
  pmapMap.roadLayer = roadLayer;
  pmapMap.satelliteLayer = satelliteLayer;

  Object.entries(GIS_CATEGORIES).forEach(([key, cat]) => {
    const group = L.layerGroup();
    cat.points.forEach(pt => {
      const icon = L.divIcon({
        html: `<div style="background:${cat.color};width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);"><span style="transform:rotate(-45deg);font-size:12px;">${cat.icon}</span></div>`,
        iconSize: [26, 26], iconAnchor: [13, 26], className: ''
      });
      const m = L.marker([pt.lat, pt.lng], { icon });
      m.on('click', () => showPmapDetails(cat, pt));
      group.addLayer(m);
      pmapMarkers.push(m);
    });
    group.addTo(pmapMap);
    pmapLayerGroups[key] = group;
  });

  pmapPickMarker = null;
  if(pmapPickMode){
    pmapMap.on('click', (e) => {
      pmapPickedLat = e.latlng.lat;
      pmapPickedLng = e.latlng.lng;
      if(pmapPickMarker) pmapMap.removeLayer(pmapPickMarker);
      const icon = L.divIcon({
        html: `<div style="background:#b6802f;width:26px;height:26px;border-radius:50% 50% 50% 0;transform:rotate(45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);"><span style="transform:rotate(-45deg);font-size:12px;">📍</span></div>`,
        iconSize: [26, 26], iconAnchor: [13, 26], className: ''
      });
      pmapPickMarker = L.marker([pmapPickedLat, pmapPickedLng], {icon}).addTo(pmapMap);
      showPmapPickConfirm(pmapPickedLat, pmapPickedLng);
    });
  }

  // Force Leaflet to recompute the container size after the popup's open
  // animation/layout settles, so tiles render correctly and dragging/zooming
  // stays responsive instead of freezing.
  pmapInvalidateTimer = setTimeout(() => {
    pmapInvalidateTimer = null;
    if(pmapMap) pmapMap.invalidateSize();
  }, 150);
}

function showPmapPickConfirm(lat, lng){
  const box = document.getElementById('pmapDetails');
  box.style.display = 'block';
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
      <div>
        <strong style="font-size:15px;">📍 Selected Location</strong><br>
        <span style="font-size:13px;">Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}</span>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="document.getElementById('pmapDetails').style.display='none'">✕ Cancel</button>
    </div>
    <button class="btn btn-sm btn-primary" style="margin-top:8px;" onclick="pmapConfirmPick()">✅ Use This Location</button>
  `;
}

function pmapConfirmPick(){
  if(pmapPickedLat===null || pmapPickedLng===null) return;
  const latInput = document.getElementById('prjLat');
  const lngInput = document.getElementById('prjLng');
  if(latInput) latInput.value = pmapPickedLat.toFixed(5);
  if(lngInput) lngInput.value = pmapPickedLng.toFixed(5);
  closeProjectMapPopup();
  toast('Location set from map', 'success');
}

function pmapToggleCategory(key, checkbox){
  if(!pmapMap || !pmapLayerGroups[key]) return;
  if(checkbox.checked){ pmapLayerGroups[key].addTo(pmapMap); }
  else { pmapMap.removeLayer(pmapLayerGroups[key]); }
}

function pmapToggleLayer(type){
  if(!pmapMap) return;
  if(type==='satellite'){
    if(pmapMap.hasLayer(pmapMap.roadLayer)) pmapMap.removeLayer(pmapMap.roadLayer);
    if(!pmapMap.hasLayer(pmapMap.satelliteLayer)) pmapMap.satelliteLayer.addTo(pmapMap);
  } else {
    if(pmapMap.hasLayer(pmapMap.satelliteLayer)) pmapMap.removeLayer(pmapMap.satelliteLayer);
    if(!pmapMap.hasLayer(pmapMap.roadLayer)) pmapMap.roadLayer.addTo(pmapMap);
  }
}

function pmapUseCurrentLocation(){
  if(!pmapMap){ toast('Project map is not ready yet. Please try again.', 'warning'); return; }
  if(!navigator.geolocation){ toast('Geolocation is not supported by this browser.', 'error'); return; }
  toast('Requesting your current location…', 'info');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = Number(pos.coords.latitude), lng = Number(pos.coords.longitude);
    if(!Number.isFinite(lat) || !Number.isFinite(lng)) { toast('Browser returned an invalid location.', 'error'); return; }
    pmapMap.setView([lat,lng],14);
    if(pmapCurrentLocationMarker) pmapMap.removeLayer(pmapCurrentLocationMarker);
    pmapCurrentLocationMarker = L.marker([lat,lng], {title:'Your current location'}).bindPopup('<strong>📍 Your Current Location</strong>').addTo(pmapMap);
    pmapCurrentLocationMarker.openPopup();
  }, err => {
    const msg = err && err.code === 1 ? 'Location permission was denied. Please allow location access in your browser.' :
      err && err.code === 2 ? 'Your current location is unavailable right now.' :
      err && err.code === 3 ? 'Location request timed out. Please try again.' : 'Unable to get your current location.';
    toast(msg, 'error');
  }, {enableHighAccuracy:true, timeout:10000, maximumAge:30000});
}

function showPmapDetails(cat, pt){
  const box = document.getElementById('pmapDetails');
  box.style.display = 'block';
  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;">
      <div>
        <strong style="font-size:15px;">${cat.icon} ${esc(pt.name)}</strong><br>
        <span style="color:var(--text-mute);font-size:12.5px;">${esc(cat.label)}</span><br>
        ${pt.address ? `<span style="font-size:13px;">${esc(pt.address)}</span>` : ''}
      </div>
      <button class="btn btn-sm btn-secondary" onclick="document.getElementById('pmapDetails').style.display='none'">✕ Close</button>
    </div>
    <a class="btn btn-sm" style="margin-top:8px;" href="https://www.google.com/maps/search/?api=1&query=${pt.lat},${pt.lng}" target="_blank" rel="noopener">🌐 View on Google Maps</a>
  `;
}

// ============================================
// VIEW: PARCELS (Enhanced with CRUD)
// ============================================
function viewParcels(){
  const search = document.getElementById('parcelSearch')?.value?.toLowerCase() || '';
  const stateFilter = document.getElementById('stateFilter')?.value || '';
  const stageFilter = document.getElementById('stageFilter')?.value || '';
  const compFilter = document.getElementById('compFilter')?.value || '';
  const riskFilter = document.getElementById('riskFilter')?.value || '';

  const filtered = data.parcels.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search) || p.surveyNo.toLowerCase().includes(search) || p.owner.toLowerCase().includes(search) || p.village.toLowerCase().includes(search);
    const matchState = !stateFilter || p.state === stateFilter;
    const matchStage = !stageFilter || p.acquisitionStage === stageFilter;
    const matchComp = !compFilter || p.compensationStatus === compFilter;
    const matchRisk = !riskFilter || 
      (riskFilter==='Low'&&p.riskScore<30) ||
      (riskFilter==='Medium'&&p.riskScore>=30&&p.riskScore<60) ||
      (riskFilter==='High'&&p.riskScore>=60&&p.riskScore<80) ||
      (riskFilter==='Critical'&&p.riskScore>=80);
    return matchSearch && matchState && matchStage && matchComp && matchRisk;
  });

  const totalArea = filtered.reduce((sum,p)=>sum+p.area,0);

  return `
    <div class="section-header">
      <div>
        <h2>📋 Parcel Registry</h2>
        <p class="subtitle">Complete registry of all land parcels under acquisition · ${filtered.length} parcels · ${totalArea.toFixed(2)} acres</p>
      </div>
      <div class="actions">
        ${canEdit() ? `<button class="btn btn-primary" onclick="openAddParcelModal()">+ Add Parcel</button>` : ''}
        ${isGov() ? `<button class="btn btn-secondary" onclick="exportCSV()">📥 Export CSV</button>
        <button class="btn btn-secondary" onclick="exportJSON()">📄 Download JSON</button>` : ''}
        <button class="btn btn-secondary" onclick="printReport()">🖨️ Print</button>
      </div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="parcelSearch" placeholder="Search by ID, Survey, Owner, Village..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="stateFilter" onchange="render()">
        <option value="">All States</option>
        ${INDIAN_STATES_UTS.map(s => 
          `<option value="${esc(s)}" ${stateFilter===s?'selected':''}>${esc(s)}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="stageFilter" onchange="render()">
        <option value="">All Stages</option>
        ${['PreliminaryNotification','SocialImpactAssessment','SurveyMeasurement','ObjectionHearing','AwardDeclaration','CompensationDisbursement','PossessionTaken','RehabilitationResettlement','Completed'].map(s =>
          `<option value="${s}" ${stageFilter===s?'selected':''}>${stageOf(s)}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="compFilter" onchange="render()">
        <option value="">All Compensation</option>
        <option value="Paid" ${compFilter==='Paid'?'selected':''}>Paid</option>
        <option value="Pending" ${compFilter==='Pending'?'selected':''}>Pending</option>
        <option value="Partial" ${compFilter==='Partial'?'selected':''}>Partial</option>
      </select>
      <select class="form-select" id="riskFilter" onchange="render()">
        <option value="">All Risk</option>
        <option value="Low" ${riskFilter==='Low'?'selected':''}>Low</option>
        <option value="Medium" ${riskFilter==='Medium'?'selected':''}>Medium</option>
        <option value="High" ${riskFilter==='High'?'selected':''}>High</option>
        <option value="Critical" ${riskFilter==='Critical'?'selected':''}>Critical</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Survey No.</th>
              <th>Parcel ID</th>
              <th>Location</th>
              <th>District</th>
              <th>State</th>
              ${isGov() ? '<th>Owner</th>' : ''}
              <th>Area (Acres)</th>
              <th>Land Type</th>
              <th>Acquisition Stage</th>
              <th>Compensation</th>
              ${isGov() ? '<th>Risk</th>' : ''}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => `
              <tr>
                <td><strong>${esc(p.surveyNo)}</strong></td>
                <td>${esc(p.id)}</td>
                <td>${esc(p.village)}</td>
                <td>${esc(p.district)}</td>
                <td>${esc(p.state)}</td>
                ${isGov() ? `<td>${esc(p.owner)}</td>` : ''}
                <td>${p.area.toFixed(2)}</td>
                <td><span class="badge badge-info">${esc(p.landType)}</span></td>
                <td><span class="badge badge-warning">${esc(stageOf(p.acquisitionStage))}</span></td>
                <td><span class="badge ${p.compensationStatus==='Paid'?'badge-success':p.compensationStatus==='Pending'?'badge-danger':'badge-warning'}">${esc(p.compensationStatus)}</span></td>
                ${isGov() ? `<td><span class="badge ${p.riskScore>70?'badge-danger':p.riskScore>40?'badge-warning':'badge-success'}">${p.riskScore}</span></td>` : ''}
                <td>
                  <button class="btn btn-sm btn-primary" onclick="viewParcelDetail('${esc(p.id)}')">View</button>
                  ${canEdit() ? `<button class="btn btn-sm btn-secondary" onclick="editParcel('${esc(p.id)}')">✏️</button>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddParcelModal(lockedProjectId){
  const project = lockedProjectId ? data.projects.find(p=>p.id===lockedProjectId) : null;
  const projects = data.projects.map(p => `<option value="${esc(p.id)}" ${p.id===lockedProjectId?'selected':''}>${esc(p.name)}</option>`).join('');
  document.getElementById('modalTitle').textContent = project ? `➕ Add Parcel to ${esc(project.name)}` : '➕ Add New Parcel';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Survey Number <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelSurveyNo" required>
      </div>
      <div class="form-group">
        <label class="form-label">Parcel ID <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelId" required>
      </div>
      <div class="form-group">
        <label class="form-label">Village <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelVillage" required>
      </div>
      <div class="form-group">
        <label class="form-label">Tehsil <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelTehsil" value="${esc(project?.district||'')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">District <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelDistrict" value="${esc(project?.district||'')}" required>
      </div>
      <div class="form-group">
        <label class="form-label">State <span class="required">*</span></label>
        <select class="form-select" id="parcelState" required>
          <option value="">Select State</option>
          ${INDIAN_STATES_UTS.map(s => `<option value="${s}" ${project?.state===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Owner <span class="required">*</span></label>
        <input type="text" class="form-input" id="parcelOwner" required>
      </div>
      <div class="form-group">
        <label class="form-label">Area (Acres) <span class="required">*</span></label>
        <input type="number" class="form-input" id="parcelArea" step="0.01" required>
      </div>
      <div class="form-group">
        <label class="form-label">Land Type <span class="required">*</span></label>
        <select class="form-select" id="parcelLandType" required>
          <option value="">Select Land Type</option>
          <option value="Agricultural">Agricultural</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Acquisition Stage <span class="required">*</span></label>
        <select class="form-select" id="parcelStage" required>
          <option value="">Select Stage</option>
          ${['PreliminaryNotification','SocialImpactAssessment','SurveyMeasurement','ObjectionHearing','AwardDeclaration','CompensationDisbursement','PossessionTaken','RehabilitationResettlement','Completed'].map(s => `<option value="${s}">${stageOf(s)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Compensation Status <span class="required">*</span></label>
        <select class="form-select" id="parcelCompStatus" required>
          <option value="">Select Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Notification Date</label>
        <input type="date" class="form-input" id="parcelNotificationDate">
      </div>
      <div class="form-group">
        <label class="form-label">Related Project</label>
        <select class="form-select" id="parcelProject" ${lockedProjectId?'disabled':''}>
          <option value="">Select Project</option>
          ${projects}
        </select>
        ${lockedProjectId ? `<input type="hidden" id="parcelProjectLocked" value="${esc(lockedProjectId)}"><div class="hint" style="margin-top:4px;">Locked to this project</div>` : ''}
      </div>
      <div class="form-group">
        <label class="form-label">Latitude</label>
        <input type="number" class="form-input" id="parcelLat" step="0.000001" placeholder="e.g., 19.0760">
      </div>
      <div class="form-group">
        <label class="form-label">Longitude</label>
        <input type="number" class="form-input" id="parcelLng" step="0.000001" placeholder="e.g., 72.8777">
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveParcel()">💾 Save Parcel</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveParcel(){
  const lockedProjectId = document.getElementById('parcelProjectLocked')?.value;
  const parcel = {
    surveyNo: document.getElementById('parcelSurveyNo').value,
    id: document.getElementById('parcelId').value,
    village: document.getElementById('parcelVillage').value,
    tehsil: document.getElementById('parcelTehsil').value,
    district: document.getElementById('parcelDistrict').value,
    state: document.getElementById('parcelState').value,
    owner: document.getElementById('parcelOwner').value,
    area: parseFloat(document.getElementById('parcelArea').value),
    landType: document.getElementById('parcelLandType').value,
    acquisitionStage: document.getElementById('parcelStage').value,
    compensationStatus: document.getElementById('parcelCompStatus').value,
    notificationDate: document.getElementById('parcelNotificationDate').value || new Date().toISOString().split('T')[0],
    projectId: lockedProjectId || document.getElementById('parcelProject').value,
    lat: parseFloat(document.getElementById('parcelLat').value) || 20.5937 + (Math.random()-0.5)*5,
    lng: parseFloat(document.getElementById('parcelLng').value) || 78.9629 + (Math.random()-0.5)*5,
    riskScore: Math.floor(Math.random()*100),
    lastUpdated: new Date().toISOString()
  };

  if(!parcel.surveyNo || !parcel.id || !parcel.village || !parcel.state || !parcel.owner || !parcel.area){
    toast('Please fill all required fields', 'error');
    return;
  }
  if(data.parcels.some(p=>p.id===parcel.id)){
    toast('A parcel with this Parcel ID already exists. Please use a unique ID.', 'error');
    return;
  }

  data.parcels.push(parcel);

  // Create workflow entry
  data.workflows.push({
    id: uid('WF'),
    parcelId: parcel.id,
    projectId: parcel.projectId,
    currentStage: parcel.acquisitionStage,
    assignedOfficer: 'Officer '+String.fromCharCode(65+(data.workflows.length%5)),
    fieldTeam: 'Team '+((data.workflows.length%3)+1),
    notificationDate: parcel.notificationDate,
    daysPending: 0,
    riskLevel: parcel.riskScore>70?'High':parcel.riskScore>50?'Medium':'Low',
    nextAction: 'Conduct Social Impact Assessment'
  });

  // Create compensation entry
  const indicative = computeCompensation(parcel.area, 2000000, 'Rural', parcel.landType);
  data.compensations.push({
    id: uid('COMP'),
    parcelId: parcel.id,
    projectId: parcel.projectId,
    surveyNo: parcel.surveyNo,
    interestedParty: parcel.owner,
    sanctionedAmount: indicative.totalCompensation,
    disbursedAmount: 0,
    pendingAmount: indicative.totalCompensation,
    paymentStatus: parcel.compensationStatus,
    paymentReference: '',
    date: parcel.notificationDate,
    remarks: 'Indicative estimate — not a substitute for statutory assessment'
  });

  // Log audit
  logAudit('Parcel Added', `Added parcel ${parcel.id} in ${parcel.state}`);

  saveData();
  closeModal();
  toast('Parcel added successfully!', 'success');
  render();
  if(lockedProjectId) viewProjectDashboard(lockedProjectId);
}

function editParcel(parcelId){
  const parcel = data.parcels.find(p=>p.id===parcelId);
  if(!parcel) return;
  
  // Simple inline edit - could be enhanced with a modal form
  const newOwner = prompt('Enter new owner name:', parcel.owner);
  if(newOwner && newOwner.trim()) {
    parcel.owner = newOwner.trim();
    parcel.lastUpdated = new Date().toISOString();
    logAudit('Parcel Updated', `Updated parcel ${parcel.id} owner to ${newOwner}`);
    saveData();
    render();
    toast('Parcel updated successfully!', 'success');
  }
}

function viewParcelDetail(parcelId){
  const parcel = data.parcels.find(p=>p.id===parcelId);
  if(!parcel) return;

  const compensation = data.compensations.find(c=>c.parcelId===parcelId);
  const workflow = data.workflows.find(w=>w.parcelId===parcelId);
  const grievances = data.grievances.filter(g=>g.parcelId===parcelId);
  const documents = data.documents.filter(d=>d.parcelId===parcelId);

  document.getElementById('modalTitle').textContent = `📋 Parcel Details: ${parcel.id}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div>
        <h4 style="margin:0 0 8px;color:var(--ink-2);">General Information</h4>
        <div style="display:grid;gap:4px;font-size:13px;">
          <div><strong>Survey Number:</strong> ${esc(parcel.surveyNo)}</div>
          <div><strong>Parcel ID:</strong> ${esc(parcel.id)}</div>
          <div><strong>Location:</strong> ${esc(parcel.village)}, ${esc(parcel.tehsil)}</div>
          <div><strong>District:</strong> ${esc(parcel.district)}</div>
          <div><strong>State:</strong> ${esc(parcel.state)}</div>
          ${isGov() ? `<div><strong>Owner:</strong> ${esc(parcel.owner)}</div>` : ''}
          <div><strong>Area:</strong> ${parcel.area.toFixed(2)} Acres</div>
          <div><strong>Land Type:</strong> <span class="badge badge-info">${esc(parcel.landType)}</span></div>
        </div>
      </div>
      <div>
        <h4 style="margin:0 0 8px;color:var(--ink-2);">Acquisition Status</h4>
        <div style="display:grid;gap:4px;font-size:13px;">
          <div><strong>Stage:</strong> <span class="badge badge-warning">${esc(stageOf(parcel.acquisitionStage))}</span></div>
          <div><strong>Compensation:</strong> <span class="badge ${parcel.compensationStatus==='Paid'?'badge-success':parcel.compensationStatus==='Pending'?'badge-danger':'badge-warning'}">${esc(parcel.compensationStatus)}</span></div>
          ${isGov() ? `<div><strong>Risk Score:</strong> <span class="badge ${parcel.riskScore>70?'badge-danger':parcel.riskScore>40?'badge-warning':'badge-success'}">${parcel.riskScore}</span></div>` : ''}
          <div><strong>Notification Date:</strong> ${fmtDate(parcel.notificationDate)}</div>
          <div><strong>Last Updated:</strong> ${fmtDateTime(parcel.lastUpdated)}</div>
          ${workflow && isGov() ? `<div><strong>Assigned Officer:</strong> ${esc(workflow.assignedOfficer)}</div>` : ''}
          ${workflow && isGov() ? `<div><strong>Field Team:</strong> ${esc(workflow.fieldTeam)}</div>` : ''}
        </div>
      </div>
    </div>

    ${compensation && isGov() ? `
      <div style="margin-top:16px;background:#f0f9ff;padding:16px;border-radius:8px;border:1px solid #bae6fd;">
        <h4 style="margin:0 0 8px;color:var(--ink-2);">💰 Compensation Details</h4>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;font-size:13px;">
          <div><strong>Sanctioned:</strong> ₹${fmtCr(compensation.sanctionedAmount)} Cr</div>
          <div><strong>Disbursed:</strong> ₹${fmtCr(compensation.disbursedAmount)} Cr</div>
          <div><strong>Pending:</strong> ₹${fmtCr(compensation.pendingAmount)} Cr</div>
          <div><strong>Status:</strong> <span class="badge ${compensation.paymentStatus==='Paid'?'badge-success':'badge-warning'}">${esc(compensation.paymentStatus)}</span></div>
        </div>
      </div>
    ` : ''}
    ${compensation && isPublic() ? `
      <div style="margin-top:16px;background:#f0f9ff;padding:16px;border-radius:8px;border:1px solid #bae6fd;">
        <h4 style="margin:0 0 8px;color:var(--ink-2);">💰 Compensation Status</h4>
        <div style="font-size:13px;"><strong>Status:</strong> <span class="badge ${compensation.paymentStatus==='Paid'?'badge-success':'badge-warning'}">${esc(compensation.paymentStatus)}</span></div>
      </div>
    ` : ''}

    ${grievances.length > 0 ? `
      <div style="margin-top:16px;">
        <h4 style="margin:0 0 8px;color:var(--ink-2);">⚠️ Grievances (${grievances.length})</h4>
        ${grievances.map(g => `
          <div style="background:#fef2f2;padding:8px 12px;border-radius:6px;margin-bottom:4px;font-size:13px;border-left:3px solid #ef4444;">
            <strong>${esc(g.id)}</strong> - ${esc(g.category)} 
            <span class="badge ${g.status==='Resolved'?'badge-success':'badge-danger'}">${esc(g.status)}</span>
            <span style="color:var(--text-faint);font-size:12px;">${fmtDate(g.date)}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${documents.length > 0 ? `
      <div style="margin-top:16px;">
        <h4 style="margin:0 0 8px;color:var(--ink-2);">📁 Documents (${documents.length})</h4>
        ${documents.map(d => `
          <div style="background:#f9fafb;padding:8px 12px;border-radius:6px;margin-bottom:4px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">
            <span><strong>${esc(d.id)}</strong> - ${esc(d.type)}</span>
            <span class="badge ${d.verificationStatus==='Verified'?'badge-success':'badge-warning'}">${esc(d.verificationStatus)}</span>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    ${canEdit() ? `<button class="btn btn-primary" onclick="editParcel('${esc(parcelId)}')">✏️ Edit</button>` : ''}
    <button class="btn btn-secondary" onclick="viewParcelOnMap('${esc(parcelId)}')">🗺️ View on Map</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function viewParcelOnMap(parcelId){
  const parcel = data.parcels.find(p=>p.id===parcelId);
  if(!parcel || !parcel.lat || !parcel.lng) {
    toast('Parcel location not available', 'error');
    return;
  }
  closeModal();
  setView('map');
  setTimeout(() => {
    if(map) {
      map.setView([parcel.lat, parcel.lng], 14);
      // Highlight marker - could be enhanced
      toast('📍 Parcel location highlighted on map', 'info');
    }
  }, 300);
}

// ============================================
// VIEW: WORKFLOWS (Enhanced)
// ============================================
function viewWorkflows(){
  const search = document.getElementById('workflowSearch')?.value?.toLowerCase() || '';
  const stageFilter = document.getElementById('workflowStageFilter')?.value || '';
  const riskFilter = document.getElementById('riskFilterWF')?.value || '';
  const teamFilter = document.getElementById('teamFilter')?.value || '';

  const filtered = data.workflows.filter(w => {
    const parcel = parcelById(w.parcelId);
    const matchSearch = w.parcelId.toLowerCase().includes(search) || w.id.toLowerCase().includes(search) || (parcel && parcel.surveyNo.toLowerCase().includes(search));
    const matchStage = !stageFilter || w.currentStage === stageFilter;
    const matchRisk = !riskFilter || w.riskLevel === riskFilter;
    const matchTeam = !teamFilter || w.fieldTeam === teamFilter;
    return matchSearch && matchStage && matchRisk && matchTeam;
  });

  const stages = ['PreliminaryNotification','SocialImpactAssessment','SurveyMeasurement','ObjectionHearing','AwardDeclaration','CompensationDisbursement','PossessionTaken','RehabilitationResettlement','Completed'];
  const stageCounts = stages.map(s => data.workflows.filter(w=>w.currentStage===s).length);
  const totalWF = data.workflows.length;
  const avgDays = totalWF > 0 ? data.workflows.reduce((sum,w)=>sum+w.daysPending,0)/totalWF : 0;

  return `
    <div class="section-header">
      <div>
        <h2>🔄 Acquisition Workflow</h2>
        <p class="subtitle">Track and manage acquisition proceedings · ${totalWF} active cases · Avg ${avgDays.toFixed(0)} days pending</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" onclick="updateAllWorkflows()">🔄 Auto-Update Stages</button>
        <button class="btn btn-secondary" onclick="exportWorkflowReport()">📊 Export Report</button>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:16px;">
      ${stages.map((s,i) => `
        <div class="card" style="padding:8px 12px;text-align:center;cursor:pointer;" onclick="setView('workflows');document.getElementById('workflowStageFilter').value='${s}';render();">
          <div style="font-size:11px;color:var(--text-faint);">${stageOf(s)}</div>
          <div style="font-size:20px;font-weight:700;color:var(--ink-2);">${stageCounts[i]}</div>
          <div class="progress-bar"><div class="fill ${stageCounts[i]>0?'green':''}" style="width:${totalWF>0?(stageCounts[i]/totalWF*100):0}%;"></div></div>
        </div>
      `).join('')}
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="workflowSearch" placeholder="Search by Parcel ID, Survey..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="workflowStageFilter" onchange="render()">
        <option value="">All Stages</option>
        ${stages.map(s => `<option value="${s}" ${stageFilter===s?'selected':''}>${stageOf(s)}</option>`).join('')}
      </select>
      <select class="form-select" id="riskFilterWF" onchange="render()">
        <option value="">All Risk</option>
        <option value="Low" ${riskFilter==='Low'?'selected':''}>Low</option>
        <option value="Medium" ${riskFilter==='Medium'?'selected':''}>Medium</option>
        <option value="High" ${riskFilter==='High'?'selected':''}>High</option>
        <option value="Critical" ${riskFilter==='Critical'?'selected':''}>Critical</option>
      </select>
      <select class="form-select" id="teamFilter" onchange="render()">
        <option value="">All Teams</option>
        ${[...new Set(data.workflows.map(w=>w.fieldTeam))].map(t => `<option value="${t}" ${teamFilter===t?'selected':''}>${t}</option>`).join('')}
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Parcel</th>
              <th>Survey</th>
              <th>State</th>
              <th>Current Stage</th>
              <th>Assigned Officer</th>
              <th>Team</th>
              <th>Days Pending</th>
              <th>Risk</th>
              <th>Next Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(w => {
              const parcel = parcelById(w.parcelId);
              return `
                <tr>
                  <td>${esc(w.projectId||'N/A')}</td>
                  <td><a href="#" onclick="viewParcelDetail('${esc(w.parcelId)}')">${esc(w.parcelId)}</a></td>
                  <td>${esc(parcel?.surveyNo||'N/A')}</td>
                  <td>${esc(parcel?.state||'N/A')}</td>
                  <td><span class="badge badge-warning">${esc(stageOf(w.currentStage))}</span></td>
                  <td>${esc(w.assignedOfficer)}</td>
                  <td><span class="badge badge-info">${esc(w.fieldTeam)}</span></td>
                  <td><span class="${w.daysPending>90?'badge badge-danger':w.daysPending>45?'badge badge-warning':''}">${w.daysPending}</span></td>
                  <td><span class="badge ${w.riskLevel==='High'?'badge-danger':w.riskLevel==='Medium'?'badge-warning':'badge-success'}">${esc(w.riskLevel)}</span></td>
                  <td>${esc(w.nextAction)}</td>
                  <td>
                    ${canEdit() ? `<button class="btn btn-sm btn-primary" onclick="updateStage('${esc(w.id)}')">Update</button>` : ''}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function updateStage(workflowId){
  const workflow = data.workflows.find(w=>w.id===workflowId);
  if(!workflow) return;

  const stages = ['PreliminaryNotification','SocialImpactAssessment','SurveyMeasurement','ObjectionHearing','AwardDeclaration','CompensationDisbursement','PossessionTaken','RehabilitationResettlement','Completed'];
  const currentIndex = stages.indexOf(workflow.currentStage);
  const nextStage = stages[currentIndex+1] || workflow.currentStage;

  if(confirm(`Update stage from "${stageOf(workflow.currentStage)}" to "${stageOf(nextStage)}"?`)){
    workflow.currentStage = nextStage;
    workflow.daysPending = 0;
    workflow.nextAction = nextStage==='Completed' ? 'Archive Records' : 'Proceed to '+stageOf(stages[currentIndex+2]||'Completed');

    const parcel = parcelById(workflow.parcelId);
    if(parcel) parcel.acquisitionStage = nextStage;

    logAudit('Stage Updated', `Updated ${workflow.parcelId} to ${nextStage}`);
    saveData();
    render();
    toast('Stage updated successfully!', 'success');
  }
}

function updateAllWorkflows(){
  if(!confirm('Auto-update all workflows to next stage?')) return;
  const stages = ['PreliminaryNotification','SocialImpactAssessment','SurveyMeasurement','ObjectionHearing','AwardDeclaration','CompensationDisbursement','PossessionTaken','RehabilitationResettlement','Completed'];
  data.workflows.forEach(w => {
    const currentIndex = stages.indexOf(w.currentStage);
    if(currentIndex < stages.length - 1 && currentIndex >= 0) {
      w.currentStage = stages[currentIndex+1];
      w.daysPending = 0;
      w.nextAction = w.currentStage==='Completed' ? 'Archive Records' : 'Proceed to '+stageOf(stages[currentIndex+2]||'Completed');
      const parcel = parcelById(w.parcelId);
      if(parcel) parcel.acquisitionStage = w.currentStage;
    }
  });
  logAudit('Bulk Stage Update', 'Updated all workflows to next stage');
  saveData();
  render();
  toast('All workflows updated!', 'success');
}

function exportWorkflowReport(){
  const headers=['Workflow ID','Parcel ID','Project ID','Current Stage','Days Pending','Status'];
  const rows=data.workflows.map(w=>[w.id,w.parcelId,w.projectId,w.currentStage,w.daysPending,w.status||'Active']);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Workflow_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Workflow Report','Exported workflow report');
  toast('Workflow report downloaded.','success');
}

// ============================================
// VIEW: COMPENSATION (Enhanced)
// ============================================
function viewCompensation(){
  const totalSanctioned = data.compensations.reduce((sum,c)=>sum+c.sanctionedAmount,0);
  const totalDisbursed = data.compensations.reduce((sum,c)=>sum+c.disbursedAmount,0);
  const pending = data.compensations.reduce((sum,c)=>sum+c.pendingAmount,0);
  const paidCount = data.compensations.filter(c=>c.paymentStatus==='Paid').length;
  const partialCount = data.compensations.filter(c=>c.paymentStatus==='Partial').length;
  const pendingCount = data.compensations.filter(c=>c.paymentStatus==='Pending').length;

  const search = document.getElementById('compSearch')?.value?.toLowerCase() || '';
  const statusFilter = document.getElementById('compStatusFilter')?.value || '';

  const filtered = data.compensations.filter(c => {
    const matchSearch = c.parcelId.toLowerCase().includes(search) || c.surveyNo.toLowerCase().includes(search) || c.interestedParty.toLowerCase().includes(search);
    const matchStatus = !statusFilter || c.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return `
    <div class="section-header">
      <div>
        <h2>💰 Compensation & Payout</h2>
        <p class="subtitle">Manage compensation disbursement · ₹${fmtCr(totalSanctioned)} Cr sanctioned · ₹${fmtCr(totalDisbursed)} Cr disbursed</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" onclick="openCompCalculator()">🧮 Calculator</button>
        <button class="btn btn-secondary" onclick="exportCompReport()">📊 Export Report</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon">📋</div>
        <div class="kpi-label">Total Sanctioned</div>
        <div class="kpi-value">₹${fmtCr(totalSanctioned)} Cr</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">✅</div>
        <div class="kpi-label">Total Disbursed</div>
        <div class="kpi-value">₹${fmtCr(totalDisbursed)} Cr</div>
        <div class="kpi-change up">${totalSanctioned>0?((totalDisbursed/totalSanctioned)*100).toFixed(1):0}% disbursed</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">⏳</div>
        <div class="kpi-label">Pending Amount</div>
        <div class="kpi-value">₹${fmtCr(pending)} Cr</div>
        <div class="kpi-change down">${pendingCount} cases pending</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon">📊</div>
        <div class="kpi-label">Cases</div>
        <div class="kpi-value">${data.compensations.length}</div>
        <div class="kpi-change">${paidCount} paid · ${partialCount} partial</div>
      </div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="compSearch" placeholder="Search by Survey, Parcel, or Party..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="compStatusFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Paid" ${statusFilter==='Paid'?'selected':''}>Paid</option>
        <option value="Pending" ${statusFilter==='Pending'?'selected':''}>Pending</option>
        <option value="Partial" ${statusFilter==='Partial'?'selected':''}>Partial</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Survey</th>
              <th>Parcel</th>
              <th>Interested Party</th>
              <th>Sanctioned (₹)</th>
              <th>Disbursed (₹)</th>
              <th>Pending (₹)</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(c => `
              <tr>
                <td><strong>${esc(c.surveyNo)}</strong></td>
                <td><a href="#" onclick="viewParcelDetail('${esc(c.parcelId)}')">${esc(c.parcelId)}</a></td>
                <td>${esc(c.interestedParty)}</td>
                <td>₹${fmtCr(c.sanctionedAmount)} Cr</td>
                <td>₹${fmtCr(c.disbursedAmount)} Cr</td>
                <td>₹${fmtCr(c.pendingAmount)} Cr</td>
                <td><span class="badge ${c.paymentStatus==='Paid'?'badge-success':c.paymentStatus==='Pending'?'badge-danger':'badge-warning'}">${esc(c.paymentStatus)}</span></td>
                <td>${fmtDate(c.date)}</td>
                <td>
                  ${c.paymentStatus!=='Paid' && canEdit() ? `<button class="btn btn-sm btn-success" onclick="processPayment('${esc(c.id)}')">💰 Pay</button>` : ''}
                  ${c.paymentStatus==='Paid' ? `<span class="badge badge-success">✓</span>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function processPayment(compId){
  const comp = data.compensations.find(c=>c.id===compId);
  if(!comp) return;

  const amount = prompt(`Enter payment amount (Max: ₹${fmtCr(comp.pendingAmount)} Cr):`, comp.pendingAmount);
  if(!amount) return;

  const payAmount = parseFloat(amount);
  if(isNaN(payAmount) || payAmount <= 0 || payAmount > comp.pendingAmount) {
    toast('Invalid amount', 'error');
    return;
  }

  comp.disbursedAmount += payAmount;
  comp.pendingAmount -= payAmount;
  if(comp.pendingAmount <= 0) {
    comp.paymentStatus = 'Paid';
    comp.pendingAmount = 0;
    const parcel = parcelById(comp.parcelId);
    if(parcel) parcel.compensationStatus = 'Paid';
  } else {
    comp.paymentStatus = 'Partial';
  }

  logAudit('Payment Processed', `₹${fmtCr(payAmount)} Cr paid to ${comp.interestedParty}`);
  saveData();
  render();
  toast('Payment processed successfully!', 'success');
}

function openCompCalculator(){
  document.getElementById('modalTitle').textContent = '🧮 Compensation Calculator (RFCTLARR 2013)';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Market Value per Acre (₹) <span class="required">*</span></label>
        <input type="number" class="form-input" id="calcMV" placeholder="Enter market value">
      </div>
      <div class="form-group">
        <label class="form-label">Area (Acres) <span class="required">*</span></label>
        <input type="number" class="form-input" id="calcArea" placeholder="Enter area">
      </div>
      <div class="form-group">
        <label class="form-label">Location Type</label>
        <select class="form-select" id="calcRural">
          <option value="Rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Land Type</label>
        <select class="form-select" id="calcLandType">
          <option value="Agricultural">Agricultural</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
        </select>
      </div>
    </div>
    <button class="btn btn-primary" onclick="calculateCompModal()">Calculate</button>
    <div id="calcResult" style="display:none;margin-top:20px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:20px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0f2fe;">
        <span>Base Market Value:</span>
        <span id="resBase">₹0</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0f2fe;">
        <span>Solatium (100%):</span>
        <span id="resSolatium">₹0</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e0f2fe;">
        <span>Rural Multiplier:</span>
        <span id="resMultiplier">₹0</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 0;font-weight:700;font-size:20px;color:#0369a1;">
        <span>Total Compensation:</span>
        <span id="resTotal">₹0</span>
      </div>
      <p style="font-size:11px;color:#64748b;margin-top:8px;font-style:italic;">⚠️ Indicative estimate — not a substitute for statutory assessment.</p>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`;
  document.getElementById('modalOverlay').classList.add('active');
}

function calculateCompModal(){
  const mv = parseFloat(document.getElementById('calcMV').value) || 0;
  const area = parseFloat(document.getElementById('calcArea').value) || 0;
  const rural = document.getElementById('calcRural').value;
  const landType = document.getElementById('calcLandType').value;

  if(!mv || !area){ toast('Please enter market value and area', 'error'); return; }

  const result = computeCompensation(area, mv, rural, landType);
  document.getElementById('resBase').textContent = '₹'+fmtCr(result.baseValue)+' Cr';
  document.getElementById('resSolatium').textContent = '₹'+fmtCr(result.solatium)+' Cr';
  document.getElementById('resMultiplier').textContent = '₹'+fmtCr(result.ruralMultiplier)+' Cr';
  document.getElementById('resTotal').textContent = '₹'+fmtCr(result.totalCompensation)+' Cr';
  document.getElementById('calcResult').style.display = 'block';
}

function exportCompReport(){
  const headers=['Compensation ID','Parcel ID','Sanctioned','Disbursed','Pending','Payment Status'];
  const rows=data.compensations.map(c=>[c.id,c.parcelId,c.sanctionedAmount,c.disbursedAmount,c.pendingAmount,c.paymentStatus]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Compensation_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Compensation Report','Exported compensation report');
  toast('Compensation report downloaded.','success');
}

// ============================================
// VIEW: FIELD TASKS (Enhanced)
// ============================================
function viewFieldTasks(){
  const search = document.getElementById('fieldSearch')?.value?.toLowerCase() || '';
  const typeFilter = document.getElementById('fieldTypeFilter')?.value || '';
  const statusFilter = document.getElementById('fieldStatusFilter')?.value || '';
  const priorityFilter = document.getElementById('fieldPriorityFilter')?.value || '';

  const filtered = data.fieldTasks.filter(t => {
    const matchSearch = t.id.toLowerCase().includes(search) || t.parcelId.toLowerCase().includes(search) || t.surveyNo.toLowerCase().includes(search);
    const matchType = !typeFilter || t.type === typeFilter;
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchSearch && matchType && matchStatus && matchPriority;
  });

  const total = data.fieldTasks.length;
  const completed = data.fieldTasks.filter(t=>t.status==='Completed').length;
  const pending = data.fieldTasks.filter(t=>t.status==='Pending').length;
  const overdue = data.fieldTasks.filter(t=>t.status==='Overdue').length;

  return `
    <div class="section-header">
      <div>
        <h2>👷 Field Operations</h2>
        <p class="subtitle">Manage field verification tasks · ${pending} pending · ${overdue} overdue</p>
      </div>
      <div class="actions">
        ${canEdit() ? `<button class="btn btn-primary" onclick="openAddTaskModal()">+ New Task</button>` : ''}
        <button class="btn btn-secondary" onclick="exportFieldReport()">📊 Export</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Total Tasks</div><div class="kpi-value">${total}</div></div>
      <div class="kpi-card"><div class="kpi-label">Completed</div><div class="kpi-value" style="color:#10b981;">${completed}</div></div>
      <div class="kpi-card"><div class="kpi-label">Pending</div><div class="kpi-value" style="color:#f59e0b;">${pending}</div></div>
      <div class="kpi-card"><div class="kpi-label">Overdue</div><div class="kpi-value" style="color:#ef4444;">${overdue}</div></div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="fieldSearch" placeholder="Search by Task ID, Project, or Survey..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="fieldTypeFilter" onchange="render()">
        <option value="">All Types</option>
        ${['Land Survey','Boundary Verification','Document Verification','Asset Inventory','GPS/GIS Verification','Physical Inspection','Possession Verification'].map(t =>
          `<option value="${t}" ${typeFilter===t?'selected':''}>${t}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="fieldStatusFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Pending" ${statusFilter==='Pending'?'selected':''}>Pending</option>
        <option value="In Progress" ${statusFilter==='In Progress'?'selected':''}>In Progress</option>
        <option value="Completed" ${statusFilter==='Completed'?'selected':''}>Completed</option>
        <option value="Overdue" ${statusFilter==='Overdue'?'selected':''}>Overdue</option>
      </select>
      <select class="form-select" id="fieldPriorityFilter" onchange="render()">
        <option value="">All Priorities</option>
        <option value="Low" ${priorityFilter==='Low'?'selected':''}>Low</option>
        <option value="Medium" ${priorityFilter==='Medium'?'selected':''}>Medium</option>
        <option value="High" ${priorityFilter==='High'?'selected':''}>High</option>
        <option value="Critical" ${priorityFilter==='Critical'?'selected':''}>Critical</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Project</th>
              <th>Parcel</th>
              <th>Survey</th>
              <th>Location</th>
              <th>Team</th>
              <th>Type</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(t => `
              <tr>
                <td><strong>${esc(t.id)}</strong></td>
                <td>${esc(t.projectId)}</td>
                <td><a href="#" onclick="viewParcelDetail('${esc(t.parcelId)}')">${esc(t.parcelId)}</a></td>
                <td>${esc(t.surveyNo)}</td>
                <td>${esc(t.location)}</td>
                <td><span class="badge badge-info">${esc(t.team)}</span></td>
                <td><span class="badge badge-purple">${esc(t.type)}</span></td>
                <td><span class="badge ${t.priority==='High'||t.priority==='Critical'?'badge-danger':t.priority==='Medium'?'badge-warning':'badge-success'}">${esc(t.priority)}</span></td>
                <td>${fmtDate(t.dueDate)}</td>
                <td><span class="badge ${t.status==='Completed'?'badge-success':t.status==='Overdue'?'badge-danger':t.status==='In Progress'?'badge-warning':'badge-info'}">${esc(t.status)}</span></td>
                <td>
                  ${t.status!=='Completed' && canEdit() ? `<button class="btn btn-sm btn-success" onclick="completeTask('${esc(t.id)}')">✓ Complete</button>` : ''}
                  ${t.status==='Completed' ? `<span class="badge badge-success">✓</span>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddTaskModal(){
  const parcels = data.parcels.map(p => `<option value="${esc(p.id)}">${p.id} - ${p.surveyNo}</option>`).join('');
  document.getElementById('modalTitle').textContent = '➕ New Field Task';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Task Type <span class="required">*</span></label>
        <select class="form-select" id="taskType">
          <option value="Land Survey">Land Survey</option>
          <option value="Boundary Verification">Boundary Verification</option>
          <option value="Document Verification">Document Verification</option>
          <option value="Asset Inventory">Asset Inventory</option>
          <option value="GPS/GIS Verification">GPS/GIS Verification</option>
          <option value="Physical Inspection">Physical Inspection</option>
          <option value="Possession Verification">Possession Verification</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Parcel <span class="required">*</span></label>
        <select class="form-select" id="taskParcel">${parcels}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Location</label>
        <input type="text" class="form-input" id="taskLocation" placeholder="Enter location">
      </div>
      <div class="form-group">
        <label class="form-label">Priority <span class="required">*</span></label>
        <select class="form-select" id="taskPriority">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Due Date <span class="required">*</span></label>
        <input type="date" class="form-input" id="taskDueDate">
      </div>
      <div class="form-group">
        <label class="form-label">Team</label>
        <select class="form-select" id="taskTeam">
          <option value="Team 1">Team 1</option>
          <option value="Team 2">Team 2</option>
          <option value="Team 3">Team 3</option>
        </select>
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveTask()">💾 Create Task</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveTask(){
  const parcelId = document.getElementById('taskParcel').value;
  const parcel = parcelById(parcelId);
  if(!parcel) { toast('Please select a parcel', 'error'); return; }

  const task = {
    id: uid('TSK'),
    projectId: parcel.projectId || 'N/A',
    parcelId: parcelId,
    surveyNo: parcel.surveyNo,
    location: document.getElementById('taskLocation').value || parcel.village,
    team: document.getElementById('taskTeam').value,
    type: document.getElementById('taskType').value,
    priority: document.getElementById('taskPriority').value,
    dueDate: document.getElementById('taskDueDate').value || new Date(Date.now()+7*86400000).toISOString().split('T')[0],
    status: 'Pending'
  };

  data.fieldTasks.push(task);
  logAudit('Task Created', `Created task ${task.id} for ${parcelId}`);
  saveData();
  closeModal();
  toast('Task created successfully!', 'success');
  render();
}

function completeTask(taskId){
  const task = data.fieldTasks.find(t=>t.id===taskId);
  if(!task || task.status==='Completed') return;

  if(confirm(`Complete task ${task.id}?`)){
    task.status = 'Completed';
    logAudit('Task Completed', `Completed task ${task.id}`);
    saveData();
    render();
    toast('Task completed!', 'success');
  }
}

function exportFieldReport(){
  const headers=['Task ID','Parcel ID','Task Type','Assigned To','Status','Due Date'];
  const rows=data.fieldTasks.map(t=>[t.id,t.parcelId,t.taskType,t.assignedTo,t.status,t.dueDate]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Field_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Field Report','Exported field operations report');
  toast('Field report downloaded.','success');
}

// ============================================
// VIEW: GRIEVANCES (Enhanced)
// ============================================
function viewGrievances(){
  const search = document.getElementById('grievSearch')?.value?.toLowerCase() || '';
  const catFilter = document.getElementById('grievCatFilter')?.value || '';
  const statusFilter = document.getElementById('grievStatusFilter')?.value || '';

  const filtered = data.grievances.filter(g => {
    const matchSearch = g.id.toLowerCase().includes(search) || g.parcelId.toLowerCase().includes(search) || g.applicantName.toLowerCase().includes(search);
    const matchCat = !catFilter || g.category === catFilter;
    const matchStatus = !statusFilter || g.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const total = data.grievances.length;
  const open = data.grievances.filter(g=>g.status==='Open').length;
  const resolved = data.grievances.filter(g=>g.status==='Resolved').length;
  const overdue = data.grievances.filter(g=>g.status==='Overdue').length;

  return `
    <div class="section-header">
      <div>
        <h2>⚠️ Grievance Redressal</h2>
        <p class="subtitle">Track and resolve public grievances · ${open} open · ${overdue} overdue</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" onclick="openAddGrievanceModal()">+ New Grievance</button>
        <button class="btn btn-secondary" onclick="exportGrievanceReport()">📊 Export</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Total</div><div class="kpi-value">${total}</div></div>
      <div class="kpi-card"><div class="kpi-label">Open</div><div class="kpi-value" style="color:#ef4444;">${open}</div></div>
      <div class="kpi-card"><div class="kpi-label">Resolved</div><div class="kpi-value" style="color:#10b981;">${resolved}</div></div>
      <div class="kpi-card"><div class="kpi-label">Overdue</div><div class="kpi-value" style="color:#ef4444;">${overdue}</div></div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="grievSearch" placeholder="Search by ID, Parcel, or Applicant..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="grievCatFilter" onchange="render()">
        <option value="">All Categories</option>
        ${['Compensation Delay','Ownership Issue','Measurement Dispute','Documentation','Rehabilitation','Possession','Other'].map(c =>
          `<option value="${c}" ${catFilter===c?'selected':''}>${c}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="grievStatusFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Open" ${statusFilter==='Open'?'selected':''}>Open</option>
        <option value="Under Review" ${statusFilter==='Under Review'?'selected':''}>Under Review</option>
        <option value="Resolved" ${statusFilter==='Resolved'?'selected':''}>Resolved</option>
        <option value="Overdue" ${statusFilter==='Overdue'?'selected':''}>Overdue</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parcel</th>
              <th>Applicant</th>
              <th>Category</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Officer</th>
              <th>Deadline</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(g => `
              <tr>
                <td><strong>${esc(g.id)}</strong></td>
                <td><a href="#" onclick="viewParcelDetail('${esc(g.parcelId)}')">${esc(g.parcelId)}</a></td>
                <td>${esc(g.applicantName)}</td>
                <td><span class="badge badge-purple">${esc(g.category)}</span></td>
                <td>${fmtDate(g.date)}</td>
                <td><span class="badge ${g.priority==='High'?'badge-danger':g.priority==='Medium'?'badge-warning':'badge-success'}">${esc(g.priority)}</span></td>
                <td><span class="badge ${g.status==='Resolved'?'badge-success':g.status==='Open'?'badge-danger':'badge-warning'}">${esc(g.status)}</span></td>
                <td>${esc(g.assignedOfficer)}</td>
                <td>${fmtDate(g.deadline)}</td>
                <td>
                  ${canEdit() ? `
                    ${g.status!=='Resolved' ? `<button class="btn btn-sm btn-success" onclick="resolveGrievance('${esc(g.id)}')">✓ Resolve</button>` : ''}
                    ${g.status==='Resolved' ? `<button class="btn btn-sm btn-secondary" onclick="resolveGrievance('${esc(g.id)}')">↺ Reopen</button>` : ''}
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddGrievanceModal(){
  const parcels = data.parcels.map(p => `<option value="${esc(p.id)}">${p.id} - ${p.surveyNo}</option>`).join('');
  document.getElementById('modalTitle').textContent = '➕ New Grievance';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Parcel <span class="required">*</span></label>
        <select class="form-select" id="grievParcel">${parcels}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Applicant Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="grievApplicant" required>
      </div>
      <div class="form-group">
        <label class="form-label">Category <span class="required">*</span></label>
        <select class="form-select" id="grievCategory">
          <option value="Compensation Delay">Compensation Delay</option>
          <option value="Ownership Issue">Ownership Issue</option>
          <option value="Measurement Dispute">Measurement Dispute</option>
          <option value="Documentation">Documentation</option>
          <option value="Rehabilitation">Rehabilitation</option>
          <option value="Possession">Possession</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority <span class="required">*</span></label>
        <select class="form-select" id="grievPriority">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Officer</label>
        <input type="text" class="form-input" id="grievOfficer" placeholder="Assigned officer">
      </div>
      <div class="form-group">
        <label class="form-label">Deadline</label>
        <input type="date" class="form-input" id="grievDeadline">
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveGrievance()">💾 Submit</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveGrievance(){
  const grievance = {
    id: uid('GRV'),
    parcelId: document.getElementById('grievParcel').value,
    applicantName: document.getElementById('grievApplicant').value,
    category: document.getElementById('grievCategory').value,
    date: new Date().toISOString().split('T')[0],
    priority: document.getElementById('grievPriority').value,
    status: 'Open',
    assignedOfficer: document.getElementById('grievOfficer').value || 'Officer A',
    deadline: document.getElementById('grievDeadline').value || new Date(Date.now()+14*86400000).toISOString().split('T')[0]
  };

  if(!grievance.applicantName){ toast('Please enter applicant name', 'error'); return; }

  data.grievances.push(grievance);
  logAudit('Grievance Filed', `Filed grievance ${grievance.id} for ${grievance.parcelId}`);
  saveData();
  closeModal();
  toast('Grievance filed successfully!', 'success');
  render();
}

function resolveGrievance(grievanceId){
  const grievance = data.grievances.find(g=>g.id===grievanceId);
  if(!grievance) return;

  if(grievance.status === 'Resolved') {
    grievance.status = 'Open';
    toast('Grievance reopened', 'info');
  } else {
    if(confirm(`Resolve grievance ${grievanceId}?`)){
      grievance.status = 'Resolved';
      logAudit('Grievance Resolved', `Resolved ${grievanceId}`);
      toast('Grievance resolved!', 'success');
    }
  }
  saveData();
  render();
}

function exportGrievanceReport(){
  const headers=['Grievance ID','Parcel ID','Category','Applicant','Priority','Status','Date'];
  const rows=data.grievances.map(g=>[g.id,g.parcelId,g.category,g.applicantName,g.priority,g.status,g.date]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Grievance_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Grievance Report','Exported grievance report');
  toast('Grievance report downloaded.','success');
}

// ============================================
// VIEW: DOCUMENTS (Enhanced)
// ============================================
function viewDocuments(){
  const search = document.getElementById('docSearch')?.value?.toLowerCase() || '';
  const typeFilter = document.getElementById('docTypeFilter')?.value || '';
  const verifFilter = document.getElementById('docVerifFilter')?.value || '';

  const filtered = data.documents.filter(d => {
    const matchSearch = d.id.toLowerCase().includes(search) || d.parcelId.toLowerCase().includes(search) || d.projectId.toLowerCase().includes(search);
    const matchType = !typeFilter || d.type === typeFilter;
    const matchVerif = !verifFilter || d.verificationStatus === verifFilter;
    return matchSearch && matchType && matchVerif;
  });

  const total = data.documents.length;
  const verified = data.documents.filter(d=>d.verificationStatus==='Verified').length;
  const pending = data.documents.filter(d=>d.verificationStatus==='Pending').length;

  return `
    <div class="section-header">
      <div>
        <h2>📁 Document Vault</h2>
        <p class="subtitle">Centralized repository · ${total} documents · ${verified} verified · ${pending} pending</p>
      </div>
      <div class="actions">
        ${canEdit() ? `<button class="btn btn-primary" onclick="openAddDocModal()">+ Upload Document</button>` : ''}
        <button class="btn btn-secondary" onclick="exportDocReport()">📊 Export</button>
      </div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="docSearch" placeholder="Search by ID, Parcel, or Project..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="docTypeFilter" onchange="render()">
        <option value="">All Types</option>
        ${['Land Record','RoR','Cadastral Map','Acquisition Notification','Survey Report','Award Document','Compensation Document','Possession Document','Rehabilitation Document','Court / Dispute Document'].map(t =>
          `<option value="${t}" ${typeFilter===t?'selected':''}>${t}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="docVerifFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Verified" ${verifFilter==='Verified'?'selected':''}>Verified</option>
        <option value="Pending" ${verifFilter==='Pending'?'selected':''}>Pending</option>
        <option value="Rejected" ${verifFilter==='Rejected'?'selected':''}>Rejected</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parcel</th>
              <th>Project</th>
              <th>Type</th>
              <th>Uploaded By</th>
              <th>Date</th>
              <th>Verification</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(d => `
              <tr>
                <td><strong>${esc(d.id)}</strong></td>
                <td><a href="#" onclick="viewParcelDetail('${esc(d.parcelId)}')">${esc(d.parcelId)}</a></td>
                <td>${esc(d.projectId)}</td>
                <td><span class="badge badge-info">${esc(d.type)}</span></td>
                <td>${esc(d.uploadedBy)}</td>
                <td>${fmtDate(d.date)}</td>
                <td><span class="badge ${d.verificationStatus==='Verified'?'badge-success':d.verificationStatus==='Rejected'?'badge-danger':'badge-warning'}">${esc(d.verificationStatus)}</span></td>
                <td>
                  ${d.fileData ? `<button class="btn btn-sm btn-secondary" onclick="downloadDocument('${esc(d.id)}')">⬇️ Download</button>` : `<span class="badge badge-warning">Metadata only</span>`}
                  ${canEdit() && d.verificationStatus!=='Verified' ? `<button class="btn btn-sm btn-success" onclick="verifyDocument('${esc(d.id)}')">✓ Verify</button>` : ''}
                  ${d.verificationStatus==='Verified' ? `<span class="badge badge-success">✓ Verified</span>` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddDocModal(){
  const parcels = data.parcels.map(p => `<option value="${esc(p.id)}">${p.id} - ${p.surveyNo}</option>`).join('');
  document.getElementById('modalTitle').textContent = '📤 Upload Document';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Document Type <span class="required">*</span></label>
        <select class="form-select" id="docType">
          <option value="Land Record">Land Record</option>
          <option value="RoR">RoR (Record of Rights)</option>
          <option value="Cadastral Map">Cadastral Map</option>
          <option value="Acquisition Notification">Acquisition Notification</option>
          <option value="Survey Report">Survey Report</option>
          <option value="Award Document">Award Document</option>
          <option value="Compensation Document">Compensation Document</option>
          <option value="Possession Document">Possession Document</option>
          <option value="Rehabilitation Document">Rehabilitation Document</option>
          <option value="Court / Dispute Document">Court / Dispute Document</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Parcel <span class="required">*</span></label>
        <select class="form-select" id="docParcel">${parcels}</select>
      </div>
      <div class="form-group" style="grid-column:1/-1;">
        <label class="form-label">File <span class="required">*</span></label>
        <input class="form-input" id="docFile" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt">
        <div class="hint">Demo-safe browser storage: maximum 2 MB per file.</div>
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveDocument()">📤 Upload</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveDocument(){
  const parcelId = document.getElementById('docParcel')?.value;
  const parcel = parcelById(parcelId);
  const fileInput = document.getElementById('docFile');
  const file = fileInput?.files?.[0];
  if(!parcel) { toast('Please select a parcel', 'error'); return; }
  if(!file) { toast('Please select a file to upload', 'error'); return; }
  if(file.size > 2 * 1024 * 1024) { toast('File exceeds the 2 MB prototype limit', 'error'); return; }
  const allowed = ['application/pdf','image/jpeg','image/png','text/plain','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const allowedExt = ['pdf','jpg','jpeg','png','txt','doc','docx','xls','xlsx'];
  if((file.type && !allowed.includes(file.type)) && !allowedExt.includes(ext)) { toast('Unsupported file type', 'error'); return; }

  const reader = new FileReader();
  reader.onerror = () => toast('Could not read the selected file', 'error');
  reader.onload = () => {
    const doc = {
      id: uid('DOC'), parcelId, projectId: parcel.projectId || 'N/A',
      type: document.getElementById('docType').value,
      uploadedBy: currentUser.name, date: new Date().toISOString().split('T')[0],
      verificationStatus: 'Pending', fileName:file.name, fileSize:file.size,
      mimeType:file.type || 'application/octet-stream', fileData:reader.result
    };
    // Keep the file as part of the prototype record so Download really works.
    data.documents.push(doc);
    if(!saveData()) { data.documents.pop(); return; }
    logAudit('Document Uploaded', `Uploaded ${doc.id} (${file.name}) for ${parcelId}`);
    closeModal();
    toast(`Document ${file.name} uploaded and stored in this browser.`, 'success');
    render();
  };
  reader.readAsDataURL(file);
}
function downloadDocument(docId){
  const doc = data.documents.find(d=>d.id===docId);
  if(!doc) { toast('Document not found', 'error'); return; }
  if(!doc.fileData) { toast('This record contains metadata only; no file is available.', 'warning'); return; }
  try {
    const a = document.createElement('a');
    a.href = doc.fileData;
    a.download = doc.fileName || `${doc.id}.bin`;
    document.body.appendChild(a); a.click(); a.remove();
    logAudit('Document Downloaded', `Downloaded ${doc.id}`);
  } catch(err) { console.error(err); toast('Document download failed', 'error'); }
}

function verifyDocument(docId){
  const doc = data.documents.find(d=>d.id===docId);
  if(!doc || doc.verificationStatus==='Verified') return;

  if(confirm(`Verify document ${docId}?`)){
    doc.verificationStatus = 'Verified';
    logAudit('Document Verified', `Verified ${docId}`);
    saveData();
    render();
    toast('Document verified!', 'success');
  }
}

function exportDocReport(){
  const headers=['Document ID','Parcel ID','Project ID','Type','File Name','Size Bytes','Uploaded By','Date','Verification'];
  const rows=data.documents.map(d=>[d.id,d.parcelId,d.projectId,d.type,d.fileName||'',d.fileSize||0,d.uploadedBy,d.date,d.verificationStatus]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Document_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Document Report','Exported document report');
  toast('Document report downloaded.','success');
}

// ============================================
// VIEW: REPORTS (Enhanced)
// ============================================
function viewReports(){
  return `
    <div class="section-header">
      <div>
        <h2>📈 Reports & Analytics</h2>
        <p class="subtitle">Comprehensive analytics and reporting dashboard</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" onclick="generateFullReport()">📊 Generate Full Report</button>
        <button class="btn btn-secondary" onclick="exportJSON()">📄 Download JSON</button>
        <button class="btn btn-secondary" onclick="printReport()">🖨️ Print</button>
      </div>
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-title">Land Type Distribution</div>
        <div class="chart-container"><canvas id="reportLandTypeChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Compensation Status</div>
        <div class="chart-container"><canvas id="reportCompensationChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Acquisition Stage Distribution</div>
        <div class="chart-container"><canvas id="reportStageChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Grievance Status</div>
        <div class="chart-container"><canvas id="reportGrievanceChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">Risk Distribution</div>
        <div class="chart-container"><canvas id="reportRiskChart"></canvas></div>
      </div>
      <div class="chart-card">
        <div class="chart-title">State-wise Parcel Count</div>
        <div class="chart-container"><canvas id="reportStateChart"></canvas></div>
      </div>
    </div>

    <div class="card" style="margin-top:20px;">
      <h4>📊 Key Metrics Summary</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;">
        <div><strong>Total Parcels:</strong> ${data.parcels.length}</div>
        <div><strong>Total Projects:</strong> ${data.projects.length}</div>
        <div><strong>Total Area:</strong> ${data.parcels.reduce((s,p)=>s+p.area,0).toFixed(2)} acres</div>
        <div><strong>Avg Risk Score:</strong> ${(data.parcels.reduce((s,p)=>s+p.riskScore,0)/data.parcels.length||0).toFixed(0)}</div>
        <div><strong>Compensation Sanctioned:</strong> ₹${fmtCr(data.compensations.reduce((s,c)=>s+c.sanctionedAmount,0))} Cr</div>
        <div><strong>Compensation Disbursed:</strong> ₹${fmtCr(data.compensations.reduce((s,c)=>s+c.disbursedAmount,0))} Cr</div>
        <div><strong>Open Grievances:</strong> ${data.grievances.filter(g=>g.status==='Open').length}</div>
        <div><strong>Completion Rate:</strong> ${(data.parcels.filter(p=>p.acquisitionStage==='Completed').length/data.parcels.length*100||0).toFixed(1)}%</div>
      </div>
    </div>
  `;
}

function initReportCharts(){
  // Clean up existing charts
  Object.values(reportCharts).forEach(c => { try { c.destroy(); } catch(e) {} });
  reportCharts = {};

  // Land Type Distribution
  const landTypeDist = {};
  data.parcels.forEach(p=>{landTypeDist[p.landType]=(landTypeDist[p.landType]||0)+1;});
  reportCharts.landType = new Chart(document.getElementById('reportLandTypeChart'),{
    type:'doughnut',
    data:{labels:Object.keys(landTypeDist), datasets:[{data:Object.values(landTypeDist), backgroundColor:['#10b981','#3b82f6','#f59e0b','#ef4444','#8b5cf6']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

  // Compensation Status
  const compStatus = {Paid:0, Pending:0, Partial:0};
  data.compensations.forEach(c=>{compStatus[c.paymentStatus]=(compStatus[c.paymentStatus]||0)+1;});
  reportCharts.compensation = new Chart(document.getElementById('reportCompensationChart'),{
    type:'doughnut',
    data:{labels:Object.keys(compStatus), datasets:[{data:Object.values(compStatus), backgroundColor:['#10b981','#f59e0b','#ef4444']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

  // Acquisition Stage
  const stageDist = {};
  data.parcels.forEach(p=>{stageDist[p.acquisitionStage]=(stageDist[p.acquisitionStage]||0)+1;});
  reportCharts.stage = new Chart(document.getElementById('reportStageChart'),{
    type:'bar',
    data:{labels:Object.keys(stageDist).map(s=>stageOf(s)), datasets:[{label:'Parcels', data:Object.values(stageDist), backgroundColor:'#3b82f6'}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });

  // Grievance Status
  const grievStatus = {Open:0, 'Under Review':0, Resolved:0, Overdue:0};
  data.grievances.forEach(g=>{grievStatus[g.status]=(grievStatus[g.status]||0)+1;});
  reportCharts.grievance = new Chart(document.getElementById('reportGrievanceChart'),{
    type:'doughnut',
    data:{labels:Object.keys(grievStatus), datasets:[{data:Object.values(grievStatus), backgroundColor:['#ef4444','#f59e0b','#10b981','#6b7280']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

  // Risk Distribution
  const riskDist = {Low:0, Medium:0, High:0, Critical:0};
  data.parcels.forEach(p=>{
    if(p.riskScore>80) riskDist.Critical++;
    else if(p.riskScore>60) riskDist.High++;
    else if(p.riskScore>40) riskDist.Medium++;
    else riskDist.Low++;
  });
  reportCharts.risk = new Chart(document.getElementById('reportRiskChart'),{
    type:'doughnut',
    data:{labels:Object.keys(riskDist), datasets:[{data:Object.values(riskDist), backgroundColor:['#10b981','#f59e0b','#ef4444','#7f1d1d']}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
  });

  // State-wise
  const stateDist = {};
  data.parcels.forEach(p=>{stateDist[p.state]=(stateDist[p.state]||0)+1;});
  reportCharts.state = new Chart(document.getElementById('reportStateChart'),{
    type:'bar',
    data:{labels:Object.keys(stateDist), datasets:[{label:'Parcels', data:Object.values(stateDist), backgroundColor:'#8b5cf6'}]},
    options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}}, scales:{y:{beginAtZero:true}}}
  });
}

function generateFullReport(){
  exportJSON();
}

// ============================================
// VIEW: AI INTELLIGENCE (Enhanced)
// ============================================
function viewAI(){
  const highRiskParcels = data.parcels.filter(p=>p.riskScore>70).sort((a,b)=>b.riskScore-a.riskScore);
  const stalled = data.workflows.filter(w=>w.daysPending>90);
  const pendingComp = data.compensations.filter(c=>c.paymentStatus==='Pending');
  const openGrievances = data.grievances.filter(g=>g.status==='Open');

  // AI Insights
  const insights = [];
  if(highRiskParcels.length > 3) insights.push(`⚠️ ${highRiskParcels.length} high-risk parcels need immediate attention`);
  if(stalled.length > 2) insights.push(`⏳ ${stalled.length} proceedings stalled for >90 days`);
  if(pendingComp.length > 5) insights.push(`💰 ${pendingComp.length} compensation cases pending`);
  if(openGrievances.length > 3) insights.push(`📢 ${openGrievances.length} open grievances require resolution`);

  return `
    <div class="section-header">
      <div>
        <h2>🤖 AI Intelligence</h2>
        <p class="subtitle">AI-powered risk analysis and intelligent insights</p>
      </div>
    </div>

    <div class="card" style="background:linear-gradient(135deg,#123a52,#0e8a7a 130%);color:white;border:1px solid rgba(255,255,255,.08);">
      <h4 style="color:#fff;">🧠 AI Insights</h4>
      ${insights.length > 0 ? insights.map(i => `<div style="padding:6px 0;font-size:14px;">${i}</div>`).join('') : '<div style="padding:6px 0;font-size:14px;">✅ All systems normal. No critical issues detected.</div>'}
    </div>

    <div class="chat-container">
      <h3>💬 AI Assistant</h3>
      <div id="aiChat">
        <div class="ai-msg">
          Hello! I'm your BhoomiSetu AI Assistant. I can help with:<br>
          • High-risk parcels analysis<br>
          • Compensation status queries<br>
          • State-wise acquisition statistics<br>
          • Grievance resolution tracking<br>
          • Project progress monitoring
        </div>
      </div>
      <div class="chat-input-row">
        <input type="text" id="aiInput" placeholder="Ask me anything..." onkeypress="if(event.key==='Enter')sendAIMessage()">
        <button class="btn btn-primary" onclick="sendAIMessage()">Send</button>
      </div>
    </div>

    <h3>🔴 High-Risk Parcels Analysis</h3>
    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Parcel ID</th>
              <th>Survey</th>
              <th>State</th>
              <th>Risk Score</th>
              <th>Risk Level</th>
              <th>Reason</th>
              <th>Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${highRiskParcels.slice(0,10).map(p => {
              const reasons = [];
              if(p.riskScore>80) reasons.push('Critical risk level');
              if(p.acquisitionStage==='PreliminaryNotification') reasons.push('Early stage');
              if(p.compensationStatus==='Pending') reasons.push('Compensation pending');
              if(p.riskScore>60 && p.acquisitionStage==='SocialImpactAssessment') reasons.push('SIA stage with elevated risk');
              if(reasons.length===0) reasons.push('Multiple risk factors');
              return `
                <tr>
                  <td><a href="#" onclick="viewParcelDetail('${esc(p.id)}')">${esc(p.id)}</a></td>
                  <td>${esc(p.surveyNo)}</td>
                  <td>${esc(p.state)}</td>
                  <td><strong>${p.riskScore}</strong></td>
                  <td><span class="badge ${p.riskScore>80?'badge-danger':'badge-warning'}">${p.riskScore>80?'Critical':'High'}</span></td>
                  <td>${reasons.join('; ')}</td>
                  <td>${p.riskScore>80?'Immediate intervention and escalation required':'Monitor closely and expedite process'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top:24px;display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;">
      <div class="card" style="border-left:4px solid #ef4444;">
        <h4>🔴 High-Risk</h4>
        <div style="font-size:28px;font-weight:bold;">${highRiskParcels.length}</div>
        <div style="font-size:12px;color:var(--text-faint);">Need immediate attention</div>
      </div>
      <div class="card" style="border-left:4px solid #f59e0b;">
        <h4>⏳ Stalled</h4>
        <div style="font-size:28px;font-weight:bold;">${stalled.length}</div>
        <div style="font-size:12px;color:var(--text-faint);">>90 days pending</div>
      </div>
      <div class="card" style="border-left:4px solid #3b82f6;">
        <h4>💰 Pending Compensation</h4>
        <div style="font-size:28px;font-weight:bold;">${pendingComp.length}</div>
        <div style="font-size:12px;color:var(--text-faint);">₹${fmtCr(pendingComp.reduce((s,c)=>s+c.pendingAmount,0))} Cr</div>
      </div>
      <div class="card" style="border-left:4px solid #8b5cf6;">
        <h4>📢 Open Grievances</h4>
        <div style="font-size:28px;font-weight:bold;">${openGrievances.length}</div>
        <div style="font-size:12px;color:var(--text-faint);">${openGrievances.filter(g=>g.priority==='High').length} high priority</div>
      </div>
    </div>
  `;
}

function initAICharts(){}

function sendAIMessage(){
  const input = document.getElementById('aiInput');
  const query = input.value.trim();
  if(!query) return;

  const chat = document.getElementById('aiChat');
  chat.innerHTML += `<div class="user-msg">${esc(query)}</div>`;

  let response = '';
  const q = query.toLowerCase();

  if(q.includes('high-risk') || q.includes('high risk') || q.includes('risk')) {
    const highRisk = data.parcels.filter(p=>p.riskScore>70);
    response = `🔴 Found <strong>${highRisk.length} high-risk parcels</strong> (risk score > 70).<br><br>`;
    if(highRisk.length > 0) {
      response += highRisk.slice(0,5).map(p => `• ${p.id} - Risk: ${p.riskScore}, Stage: ${stageOf(p.acquisitionStage)}, State: ${p.state}`).join('<br>');
      response += highRisk.length > 5 ? `<br>... and ${highRisk.length-5} more` : '';
    }
  } else if(q.includes('compensation') && q.includes('pending')) {
    const pending = data.compensations.filter(c=>c.paymentStatus==='Pending');
    response = `💰 Found <strong>${pending.length} pending compensation cases</strong>.<br><br>`;
    if(pending.length > 0) {
      response += pending.slice(0,5).map(c => `• ${c.parcelId} - ₹${fmtCr(c.pendingAmount)} Cr pending (${c.interestedParty})`).join('<br>');
    }
  } else if(q.includes('state') && (q.includes('highest') || q.includes('activity') || q.includes('distribution'))) {
    const states = {};
    data.parcels.forEach(p=>{states[p.state]=(states[p.state]||0)+1;});
    const sorted = Object.entries(states).sort((a,b)=>b[1]-a[1]);
    response = `<strong>🏛️ State-wise Acquisition Activity:</strong><br><br>`;
    response += sorted.map(([state,count]) => `• ${state}: ${count} parcels (${(count/data.parcels.length*100).toFixed(1)}%)`).join('<br>');
  } else if(q.includes('grievance') || q.includes('complaint')) {
    const open = data.grievances.filter(g=>g.status==='Open');
    const resolved = data.grievances.filter(g=>g.status==='Resolved');
    response = `📢 <strong>Grievance Summary:</strong><br><br>`;
    response += `• Open: ${open.length}<br>`;
    response += `• Resolved: ${resolved.length}<br>`;
    response += `• Overdue: ${data.grievances.filter(g=>g.status==='Overdue').length}<br>`;
    if(open.length > 0) {
      response += `<br><strong>Open Grievances:</strong><br>`;
      response += open.slice(0,5).map(g => `• ${g.id} - ${g.category} (${g.applicantName}) - ${g.priority} priority`).join('<br>');
    }
  } else if(q.includes('project') && q.includes('progress')) {
    const active = data.projects.filter(p=>p.status==='Active');
    response = `🏗️ <strong>Project Progress Summary:</strong><br><br>`;
    response += `• Active Projects: ${active.length}<br>`;
    response += `• Total Parcels: ${data.parcels.length}<br>`;
    response += `• Completion Rate: ${(data.parcels.filter(p=>p.acquisitionStage==='Completed').length/data.parcels.length*100||0).toFixed(1)}%<br>`;
    response += `• Compensation Disbursed: ${(data.compensations.reduce((s,c)=>s+c.disbursedAmount,0)/data.compensations.reduce((s,c)=>s+c.sanctionedAmount,0)*100||0).toFixed(1)}%<br><br>`;
    response += active.slice(0,3).map(p => `• ${p.name}: ${p.status} (${p.currentStage})`).join('<br>');
  } else if(q.includes('stalled') || q.includes('delay')) {
    const stalled = data.workflows.filter(w=>w.daysPending>90);
    response = `⏳ Found <strong>${stalled.length} stalled proceedings</strong> (>90 days pending).<br><br>`;
    if(stalled.length > 0) {
      response += stalled.slice(0,5).map(w => `• ${w.parcelId} - ${w.daysPending} days in ${stageOf(w.currentStage)}`).join('<br>');
    }
  } else if(q.includes('priorit') || q.includes('what should') || q.includes('urgent')) {
    const candidates = data.parcels.map(p=>{
      const wf=data.workflows.find(w=>w.parcelId===p.id);
      const comp=data.compensations.find(c=>c.parcelId===p.id);
      const gr=data.grievances.filter(g=>g.parcelId===p.id && g.status!=='Resolved');
      const reasons=[]; let score=Number(p.riskScore||0);
      if(p.riskScore>70){score+=20; reasons.push('high risk score');}
      if(wf && Number(wf.daysPending)>90){score+=25; reasons.push('proceeding stalled >90 days');}
      if(comp && comp.paymentStatus!=='Paid'){score+=15; reasons.push('compensation pending');}
      if(gr.length){score+=10*gr.length; reasons.push(`${gr.length} unresolved grievance${gr.length>1?'s':''}`);}
      return {p,score,reasons};
    }).filter(x=>x.reasons.length).sort((a,b)=>b.score-a.score).slice(0,5);
    response='<strong>🎯 Priority queue from current data:</strong><br><br>'+ (candidates.length ? candidates.map((x,i)=>`${i+1}. <strong>${esc(x.p.id)}</strong> — priority score ${x.score}<br><span style=\"font-size:12px;color:#6b7280;\">Why: ${esc(x.reasons.join(', '))}</span>`).join('<br>') : 'No urgent records detected from the current dataset.') + '<br><br><strong>Recommendation:</strong> Review the highest-scoring parcel first, then address the blocking workflow, compensation or grievance issue shown above.';
  } else if(q.includes('help') || q.includes('what can you do')) {
    response = `🤖 I can help you with:<br><br>
      • <strong>High-risk parcels</strong> - Show parcels with elevated risk<br>
      • <strong>Pending compensation</strong> - List pending compensation cases<br>
      • <strong>State-wise activity</strong> - Show acquisition by state<br>
      • <strong>Grievance status</strong> - Summary of grievances<br>
      • <strong>Project progress</strong> - Overall project status<br>
      • <strong>Stalled proceedings</strong> - Delayed acquisitions<br>
      • <strong>Dashboard overview</strong> - Key metrics summary`;
  } else {
    // General response with summary
    const totalParcels = data.parcels.length;
    const totalComp = data.compensations.reduce((s,c)=>s+c.sanctionedAmount,0);
    const disbursedComp = data.compensations.reduce((s,c)=>s+c.disbursedAmount,0);
    response = `📊 <strong>BhoomiSetu AI Summary</strong><br><br>
      • Total Parcels: <strong>${totalParcels}</strong><br>
      • Active Projects: <strong>${data.projects.filter(p=>p.status==='Active').length}</strong><br>
      • Compensation Sanctioned: <strong>₹${fmtCr(totalComp)} Cr</strong><br>
      • Compensation Disbursed: <strong>₹${fmtCr(disbursedComp)} Cr</strong><br>
      • Disbursement Rate: <strong>${totalComp>0?(disbursedComp/totalComp*100).toFixed(1):0}%</strong><br>
      • Open Grievances: <strong>${data.grievances.filter(g=>g.status==='Open').length}</strong><br>
      • High-Risk Parcels: <strong>${data.parcels.filter(p=>p.riskScore>70).length}</strong><br>
      • Completion Rate: <strong>${(data.parcels.filter(p=>p.acquisitionStage==='Completed').length/totalParcels*100||0).toFixed(1)}%</strong><br><br>
      Try asking about specific areas like "high-risk parcels", "pending compensation", or "state-wise activity".`;
  }

  setTimeout(() => {
    chat.innerHTML += `<div class="ai-msg">${response}</div>`;
    chat.scrollTop = chat.scrollHeight;
  }, 300);

  input.value = '';
}

// ============================================
// VIEW: ALERTS (Enhanced)
// ============================================
function viewAlerts(){
  const alerts = data.alerts.filter(a=>!a.acknowledged);
  const allAlerts = data.alerts;

  return `
    <div class="section-header">
      <div>
        <h2>🔔 Alerts & Notifications</h2>
        <p class="subtitle">${alerts.length} unacknowledged alerts requiring attention</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" onclick="acknowledgeAllAlerts()">✓ Acknowledge All</button>
        <button class="btn btn-secondary" onclick="viewAllAlerts()">📋 View All</button>
      </div>
    </div>

    ${alerts.length > 0 ? `
      <div style="display:grid;gap:12px;">
        ${alerts.map(a => `
          <div class="card" style="border-left:4px solid ${a.severity==='high'?'#ef4444':'#f59e0b'};display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
            <div>
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="badge ${a.severity==='high'?'badge-danger':'badge-warning'}">${a.severity.toUpperCase()}</span>
                <strong>${esc(a.type)}</strong>
                <span style="color:var(--text-faint);font-size:12px;">${fmtDate(a.date)}</span>
              </div>
              <p style="margin:4px 0 0;color:var(--text-mute);font-size:13px;">${esc(a.message)}</p>
              ${a.parcelId ? `<small style="color:var(--text-faint);">Parcel: <a href="#" onclick="viewParcelDetail('${esc(a.parcelId)}')">${esc(a.parcelId)}</a></small>` : ''}
            </div>
            <button class="btn btn-sm btn-success" onclick="acknowledgeAlert('${esc(a.id)}')">✓ Acknowledge</button>
          </div>
        `).join('')}
      </div>
    ` : `
      <div class="card" style="text-align:center;padding:40px;">
        <div style="font-size:48px;margin-bottom:12px;">✅</div>
        <h3 style="color:var(--ink-2);">No Active Alerts</h3>
        <p style="color:var(--text-faint);">All systems are running smoothly. You have no unacknowledged alerts.</p>
      </div>
    `}

    ${allAlerts.length > 0 ? `
      <div style="margin-top:24px;">
        <h4 style="color:var(--ink-2);">Recent Alert History</h4>
        <div class="table-wrap">
          <div class="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Severity</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${allAlerts.slice(0,10).map(a => `
                  <tr>
                    <td><strong>${esc(a.id)}</strong></td>
                    <td>${esc(a.type)}</td>
                    <td>${esc(a.message)}</td>
                    <td><span class="badge ${a.severity==='high'?'badge-danger':'badge-warning'}">${esc(a.severity)}</span></td>
                    <td>${fmtDate(a.date)}</td>
                    <td><span class="badge ${a.acknowledged?'badge-success':'badge-warning'}">${a.acknowledged?'Acknowledged':'Pending'}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ` : ''}
  `;
}

function acknowledgeAlert(alertId){
  const alert = data.alerts.find(a=>a.id===alertId);
  if(alert) {
    alert.acknowledged = true;
    logAudit('Alert Acknowledged', `Acknowledged ${alertId}`);
    saveData();
    render();
    toast('Alert acknowledged', 'success');
  }
}

function acknowledgeAllAlerts(){
  if(!confirm('Acknowledge all alerts?')) return;
  data.alerts.forEach(a => a.acknowledged = true);
  logAudit('All Alerts Acknowledged', 'Acknowledged all alerts');
  saveData();
  render();
  toast('All alerts acknowledged!', 'success');
}

function viewAllAlerts(){
  toast('Showing all alerts in the history table below', 'info');
}

// ============================================
// VIEW: PROJECTS (Enhanced)
// ============================================
function viewProjects(){
  const search = document.getElementById('projectSearch')?.value?.toLowerCase() || '';
  const stateFilter = document.getElementById('projectStateFilter')?.value || '';
  const statusFilter = document.getElementById('projectStatusFilter')?.value || '';

  const filtered = data.projects.filter(p => {
    const matchSearch = p.id.toLowerCase().includes(search) || p.name.toLowerCase().includes(search) || p.agency.toLowerCase().includes(search);
    const matchState = !stateFilter || p.state === stateFilter;
    const matchStatus = !statusFilter || p.status === statusFilter;
    return matchSearch && matchState && matchStatus;
  });

  return `
    <div class="section-header">
      <div>
        <h2>🏗️ Projects</h2>
        <p class="subtitle">Manage all land acquisition projects · ${data.projects.length} total</p>
      </div>
      <div class="actions">
        ${canEdit() ? `<button class="btn btn-primary" onclick="openAddProjectModal()">+ New Project</button>` : ''}
        <button class="btn btn-secondary" onclick="exportProjectReport()">📊 Export</button>
      </div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="projectSearch" placeholder="Search by ID, Name, or Agency..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="projectStateFilter" onchange="render()">
        <option value="">All States</option>
        ${INDIAN_STATES_UTS.map(s =>
          `<option value="${s}" ${stateFilter===s?'selected':''}>${s}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="projectStatusFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Active" ${statusFilter==='Active'?'selected':''}>Active</option>
        <option value="Planning" ${statusFilter==='Planning'?'selected':''}>Planning</option>
        <option value="Completed" ${statusFilter==='Completed'?'selected':''}>Completed</option>
        <option value="On Hold" ${statusFilter==='On Hold'?'selected':''}>On Hold</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Name</th>
              <th>Agency</th>
              <th>State</th>
              <th>District</th>
              <th>Type</th>
              <th>Land Required</th>
              <th>Land Acquired</th>
              <th>Parcels</th>
              <th>Compensation</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(p => {
              const projectParcels = data.parcels.filter(parcel=>parcel.projectId===p.id);
              const projectComp = data.compensations.filter(c=>projectParcels.some(parcel=>parcel.id===c.parcelId));
              const totalComp = projectComp.reduce((sum,c)=>sum+c.sanctionedAmount,0);
              const acquiredArea = projectParcels.reduce((sum,parcel)=>sum+parcel.area,0);
              return `
                <tr>
                  <td><strong>${esc(p.id)}</strong></td>
                  <td>${esc(p.name)}</td>
                  <td>${esc(p.agency)}</td>
                  <td>${esc(p.state)}</td>
                  <td>${esc(p.district)}</td>
                  <td><span class="badge badge-purple">${esc(p.type)}</span></td>
                  <td>${p.landRequired.toFixed(1)}</td>
                  <td>${acquiredArea.toFixed(1)}</td>
                  <td>${projectParcels.length}</td>
                  <td>₹${fmtCr(totalComp)} Cr</td>
                  <td><span class="badge badge-warning">${esc(p.currentStage)}</span></td>
                  <td><span class="badge ${p.status==='Active'?'badge-success':p.status==='Completed'?'badge-info':'badge-warning'}">${esc(p.status)}</span></td>
                  <td><button class="btn btn-sm btn-primary" onclick="viewProjectDashboard('${esc(p.id)}')">📊 View</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddProjectModal(){
  document.getElementById('modalTitle').textContent = '➕ New Project';
  document.getElementById('modalBody').innerHTML = `
    <div style="margin-bottom:16px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
      <button type="button" class="btn btn-secondary" onclick="openProjectMapPopup(false)">🗺️ Project Map</button>
      <button type="button" class="btn btn-secondary" onclick="openProjectMapPopup(true)">📍 Pick Location on Map</button>
      <span style="font-size:12px;color:var(--text-mute);">Check nearby airports, hospitals, petrol pumps &amp; railway stations, or click "Pick Location" to set exact coordinates.</span>
    </div>
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Project Name <span class="required">*</span></label>
        <input type="text" class="form-input" id="prjName" required>
      </div>
      <div class="form-group">
        <label class="form-label">Agency <span class="required">*</span></label>
        <input type="text" class="form-input" id="prjAgency" required>
      </div>
      <div class="form-group">
        <label class="form-label">State <span class="required">*</span></label>
        <select class="form-select" id="prjState" required>
          <option value="">Select State</option>
          ${INDIAN_STATES_UTS.map(s =>
            `<option value="${s}">${s}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">District <span class="required">*</span></label>
        <input type="text" class="form-input" id="prjDistrict" required>
      </div>
      <div class="form-group">
        <label class="form-label">Project Type <span class="required">*</span></label>
        <select class="form-select" id="prjType" required>
          <option value="Highway">Highway</option>
          <option value="Railway">Railway</option>
          <option value="Industrial">Industrial</option>
          <option value="Urban Development">Urban Development</option>
          <option value="Power Infrastructure">Power Infrastructure</option>
          <option value="Irrigation">Irrigation</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Land Required (Acres) <span class="required">*</span></label>
        <input type="number" class="form-input" id="prjLandRequired" step="0.1" required>
      </div>
      <div class="form-group">
        <label class="form-label">Latitude <span style="color:var(--text-mute);font-weight:400;">(optional)</span></label>
        <input type="number" class="form-input" id="prjLat" step="0.00001" placeholder="e.g. 18.5246">
      </div>
      <div class="form-group">
        <label class="form-label">Longitude <span style="color:var(--text-mute);font-weight:400;">(optional)</span></label>
        <input type="number" class="form-input" id="prjLng" step="0.00001" placeholder="e.g. 73.8786">
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveProject()">💾 Create Project</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveProject(){
  const name = document.getElementById('prjName').value;
  const agency = document.getElementById('prjAgency').value;
  const state = document.getElementById('prjState').value;
  const district = document.getElementById('prjDistrict').value;
  const type = document.getElementById('prjType').value;
  const landRequired = parseFloat(document.getElementById('prjLandRequired').value);
  const latRaw = document.getElementById('prjLat').value;
  const lngRaw = document.getElementById('prjLng').value;
  const lat = latRaw !== '' ? parseFloat(latRaw) : null;
  const lng = lngRaw !== '' ? parseFloat(lngRaw) : null;

  if(!name || !agency || !state || !district || !landRequired){
    toast('Please fill all required fields', 'error');
    return;
  }

  const project = {
    id: uid('PRJ'),
    name,
    agency,
    state,
    district,
    type,
    landRequired,
    lat: (lat!==null && !isNaN(lat)) ? lat : null,
    lng: (lng!==null && !isNaN(lng)) ? lng : null,
    landAcquired: 0,
    parcels: 0,
    compensation: 0,
    currentStage: 'Planning',
    status: 'Active',
    startDate: new Date().toISOString().split('T')[0],
    lastUpdated: new Date().toISOString()
  };

  data.projects.push(project);
  logAudit('Project Created', `Created ${project.id}: ${project.name}`);
  saveData();
  closeModal();
  toast('Project created successfully!', 'success');
  render();
}

function viewProjectDashboard(projectId){
  // Clean up any existing modal charts
  if(modalChartTimeout) { clearTimeout(modalChartTimeout); modalChartTimeout = null; }
  Object.values(modalCharts).forEach(c => { try { c.destroy(); } catch(e) {} });
  modalCharts = {};

  const project = data.projects.find(p=>p.id===projectId);
  if(!project) { toast('Project not found', 'error'); return; }

  const projectParcels = data.parcels.filter(p=>p.projectId===projectId);
  const projectComp = data.compensations.filter(c=>projectParcels.some(p=>p.id===c.parcelId));
  const totalArea = projectParcels.reduce((sum,p)=>sum+p.area,0);
  const totalComp = projectComp.reduce((sum,c)=>sum+c.sanctionedAmount,0);
  const avgRisk = projectParcels.length > 0 ? projectParcels.reduce((sum,p)=>sum+p.riskScore,0)/projectParcels.length : 0;
  const completionRate = projectParcels.length > 0 ? (projectParcels.filter(p=>p.acquisitionStage==='Completed').length/projectParcels.length*100) : 0;

  document.getElementById('modalTitle').textContent = `📊 ${project.name}`;
  document.getElementById('modalBody').innerHTML = `
    <div style="background:linear-gradient(135deg,#123a52,#0e8a7a 130%);color:white;padding:20px;border-radius:12px;margin-bottom:20px;border:1px solid rgba(255,255,255,.08);">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
        <div>
          <h3 style="margin:0 0 4px;">${esc(project.name)}</h3>
          <p style="margin:0;opacity:0.8;">${esc(project.agency)} · ${esc(project.district)}, ${esc(project.state)}</p>
        </div>
        <span class="badge ${project.status==='Active'?'badge-success':project.status==='Completed'?'badge-info':'badge-warning'}" style="font-size:14px;padding:4px 16px;">${esc(project.status)}</span>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">Parcels</div>
        <div class="kpi-value">${projectParcels.length}</div>
        <div class="kpi-sub">${projectParcels.filter(p=>p.acquisitionStage==='Completed').length} completed</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Land Area</div>
        <div class="kpi-value">${totalArea.toFixed(2)} acres</div>
        <div class="kpi-sub">${(totalArea/project.landRequired*100||0).toFixed(1)}% of required</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Compensation</div>
        <div class="kpi-value">₹${fmtCr(totalComp)} Cr</div>
        <div class="kpi-sub">${projectComp.filter(c=>c.paymentStatus==='Paid').length} paid</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Avg Risk Score</div>
        <div class="kpi-value">${avgRisk.toFixed(0)}</div>
        <div class="kpi-sub">${completionRate.toFixed(0)}% complete</div>
      </div>
    </div>

    <div style="margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:16px;">
      <div class="card">
        <h4>Acquisition Pipeline</h4>
        <div style="height:200px;"><canvas id="projectStageChart"></canvas></div>
      </div>
      <div class="card">
        <h4>Compensation Status</h4>
        <div style="height:200px;"><canvas id="projectCompChart"></canvas></div>
      </div>
    </div>

    <h4 style="margin:16px 0 8px;">Project Parcels</h4>
    <div class="table-wrap" style="max-height:300px;overflow-y:auto;">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Parcel ID</th>
              <th>Survey</th>
              <th>Location</th>
              <th>Area</th>
              <th>Stage</th>
              <th>Risk</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${projectParcels.map(p => `
              <tr>
                <td><strong>${esc(p.id)}</strong></td>
                <td>${esc(p.surveyNo)}</td>
                <td>${esc(p.village)}, ${esc(p.tehsil)}</td>
                <td>${p.area.toFixed(2)}</td>
                <td><span class="badge badge-warning">${esc(stageOf(p.acquisitionStage))}</span></td>
                <td><span class="badge ${p.riskScore>70?'badge-danger':p.riskScore>40?'badge-warning':'badge-success'}">${p.riskScore}</span></td>
                <td><button class="btn btn-sm btn-primary" onclick="viewParcelDetail('${esc(p.id)}')">View</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Close</button>
    ${canEdit() ? `<button class="btn btn-primary" onclick="openAddParcelModal('${esc(projectId)}')">+ Add Parcel</button>` : ''}
    <button class="btn btn-secondary" onclick="generateProjectReport('${esc(projectId)}')">📊 Report</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');

  // Initialize charts after modal is shown
  modalChartTimeout = setTimeout(() => {
    const stageDist = {};
    projectParcels.forEach(p=>{stageDist[p.acquisitionStage]=(stageDist[p.acquisitionStage]||0)+1;});
    modalCharts.stage = new Chart(document.getElementById('projectStageChart'),{
      type:'doughnut',
      data:{labels:Object.keys(stageDist).map(s=>stageOf(s)), datasets:[{data:Object.values(stageDist), backgroundColor:['#2f6e5c','#3f7a95','#b6802f','#a4402b','#6b7280','#10b981','#f59e0b']}]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });

    const compStatus = {Paid:0, Pending:0, Partial:0};
    projectComp.forEach(c=>{compStatus[c.paymentStatus]=(compStatus[c.paymentStatus]||0)+1;});
    modalCharts.comp = new Chart(document.getElementById('projectCompChart'),{
      type:'doughnut',
      data:{labels:Object.keys(compStatus), datasets:[{data:Object.values(compStatus), backgroundColor:['#10b981','#f59e0b','#ef4444']}]},
      options:{responsive:true, maintainAspectRatio:false, plugins:{legend:{position:'bottom'}}}
    });
    modalChartTimeout = null;
  }, 150);
}

function generateProjectReport(projectId){
  const p=data.projects.find(x=>x.id===projectId);
  if(!p){toast('Project not found','error');return;}
  const ps=data.parcels.filter(x=>x.projectId===projectId);
  const report={generatedAt:new Date().toISOString(),project:p,summary:{parcelCount:ps.length,totalArea:ps.reduce((s,x)=>s+Number(x.area||0),0),highRisk:ps.filter(x=>x.riskScore>70).length},parcels:ps,grievances:data.grievances.filter(g=>ps.some(x=>x.id===g.parcelId)),compensation:data.compensations.filter(c=>ps.some(x=>x.id===c.parcelId))};
  downloadBlob(JSON.stringify(report,null,2),`BhoomiSetu_${projectId}_Report.json`,'application/json;charset=utf-8');
  logAudit('Generate Project Report',`Generated report for ${projectId}`);
  toast('Project report downloaded.','success');
}

function exportProjectReport(){
  const headers=['Project ID','Project','Agency','State','Status','Parcels','Area'];
  const rows=data.projects.map(p=>{const ps=data.parcels.filter(x=>x.projectId===p.id);return [p.id,p.name,p.agency,p.state,p.status,ps.length,ps.reduce((s,x)=>s+Number(x.area||0),0)];});
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Project_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Project Report','Exported project report');
  toast('Project report downloaded.','success');
}

// ============================================
// VIEW: DISPUTES (Enhanced)
// ============================================
function viewDisputes(){
  const search = document.getElementById('disputeSearch')?.value?.toLowerCase() || '';
  const catFilter = document.getElementById('disputeCatFilter')?.value || '';
  const statusFilter = document.getElementById('disputeStatusFilter')?.value || '';

  const filtered = data.disputes.filter(d => {
    const matchSearch = d.id.toLowerCase().includes(search) || d.parcelId.toLowerCase().includes(search) || d.surveyNo.toLowerCase().includes(search);
    const matchCat = !catFilter || d.category === catFilter;
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const total = data.disputes.length;
  const open = data.disputes.filter(d=>d.status!=='Resolved').length;
  const resolved = data.disputes.filter(d=>d.status==='Resolved').length;

  return `
    <div class="section-header">
      <div>
        <h2>⚖️ Dispute Management</h2>
        <p class="subtitle">Track legal disputes · ${open} open · ${resolved} resolved</p>
      </div>
      <div class="actions">
        ${canEdit() ? `<button class="btn btn-primary" onclick="openAddDisputeModal()">+ New Dispute</button>` : ''}
        <button class="btn btn-secondary" onclick="exportDisputeReport()">📊 Export</button>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Total</div><div class="kpi-value">${total}</div></div>
      <div class="kpi-card"><div class="kpi-label">Open</div><div class="kpi-value" style="color:#ef4444;">${open}</div></div>
      <div class="kpi-card"><div class="kpi-label">Resolved</div><div class="kpi-value" style="color:#10b981;">${resolved}</div></div>
      <div class="kpi-card"><div class="kpi-label">In Court</div><div class="kpi-value" style="color:#f59e0b;">${data.disputes.filter(d=>d.status==='In Court').length}</div></div>
    </div>

    <div class="filters">
      <input type="text" class="search-input" id="disputeSearch" placeholder="Search by ID, Parcel, or Survey..." oninput="render()" value="${esc(search)}">
      <select class="form-select" id="disputeCatFilter" onchange="render()">
        <option value="">All Categories</option>
        ${['Ownership Dispute','Compensation Dispute','Boundary Dispute','Title Dispute','Acquisition Challenge','Other'].map(c =>
          `<option value="${c}" ${catFilter===c?'selected':''}>${c}</option>`
        ).join('')}
      </select>
      <select class="form-select" id="disputeStatusFilter" onchange="render()">
        <option value="">All Status</option>
        <option value="Open" ${statusFilter==='Open'?'selected':''}>Open</option>
        <option value="Under Review" ${statusFilter==='Under Review'?'selected':''}>Under Review</option>
        <option value="In Court" ${statusFilter==='In Court'?'selected':''}>In Court</option>
        <option value="Resolved" ${statusFilter==='Resolved'?'selected':''}>Resolved</option>
      </select>
    </div>

    <div class="table-wrap">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Parcel</th>
              <th>Survey</th>
              <th>Category</th>
              <th>Filed Date</th>
              <th>Status</th>
              <th>Officer</th>
              <th>Priority</th>
              <th>Next Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map(d => `
              <tr>
                <td><strong>${esc(d.id)}</strong></td>
                <td><a href="#" onclick="viewParcelDetail('${esc(d.parcelId)}')">${esc(d.parcelId)}</a></td>
                <td>${esc(d.surveyNo)}</td>
                <td><span class="badge badge-purple">${esc(d.category)}</span></td>
                <td>${fmtDate(d.filedDate)}</td>
                <td><span class="badge ${d.status==='Resolved'?'badge-success':d.status==='Open'?'badge-danger':'badge-warning'}">${esc(d.status)}</span></td>
                <td>${esc(d.assignedOfficer)}</td>
                <td><span class="badge ${d.priority==='High'?'badge-danger':'badge-warning'}">${esc(d.priority)}</span></td>
                <td>${esc(d.nextAction)}</td>
                <td>
                  ${canEdit() ? `
                    ${d.status!=='Resolved' ? `<button class="btn btn-sm btn-success" onclick="resolveDispute('${esc(d.id)}')">✓ Resolve</button>` : ''}
                    ${d.status==='Resolved' ? `<button class="btn btn-sm btn-secondary" onclick="resolveDispute('${esc(d.id)}')">↺ Reopen</button>` : ''}
                  ` : ''}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function openAddDisputeModal(){
  const parcels = data.parcels.map(p => `<option value="${esc(p.id)}">${p.id} - ${p.surveyNo}</option>`).join('');
  document.getElementById('modalTitle').textContent = '➕ New Dispute';
  document.getElementById('modalBody').innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label class="form-label">Parcel <span class="required">*</span></label>
        <select class="form-select" id="disputeParcel">${parcels}</select>
      </div>
      <div class="form-group">
        <label class="form-label">Category <span class="required">*</span></label>
        <select class="form-select" id="disputeCategory">
          <option value="Ownership Dispute">Ownership Dispute</option>
          <option value="Compensation Dispute">Compensation Dispute</option>
          <option value="Boundary Dispute">Boundary Dispute</option>
          <option value="Title Dispute">Title Dispute</option>
          <option value="Acquisition Challenge">Acquisition Challenge</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Priority <span class="required">*</span></label>
        <select class="form-select" id="disputePriority">
          <option value="Low">Low</option>
          <option value="Medium" selected>Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Assigned Officer</label>
        <input type="text" class="form-input" id="disputeOfficer" placeholder="Assigned officer">
      </div>
      <div class="form-group">
        <label class="form-label">Next Action</label>
        <input type="text" class="form-input" id="disputeAction" placeholder="Next action item">
      </div>
    </div>
  `;
  document.getElementById('modalFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn btn-primary" onclick="saveDispute()">💾 Create</button>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}

function saveDispute(){
  const parcelId = document.getElementById('disputeParcel').value;
  const parcel = parcelById(parcelId);
  if(!parcel) { toast('Please select a parcel', 'error'); return; }

  const dispute = {
    id: uid('DSP'),
    parcelId,
    surveyNo: parcel.surveyNo,
    category: document.getElementById('disputeCategory').value,
    filedDate: new Date().toISOString().split('T')[0],
    status: 'Open',
    assignedOfficer: document.getElementById('disputeOfficer').value || 'Officer A',
    priority: document.getElementById('disputePriority').value,
    nextAction: document.getElementById('disputeAction').value || 'Review case'
  };

  data.disputes.push(dispute);
  logAudit('Dispute Filed', `Filed ${dispute.id} for ${parcelId}`);
  saveData();
  closeModal();
  toast('Dispute filed successfully!', 'success');
  render();
}

function resolveDispute(disputeId){
  const dispute = data.disputes.find(d=>d.id===disputeId);
  if(!dispute) return;

  if(dispute.status === 'Resolved') {
    dispute.status = 'Open';
    dispute.nextAction = 'Case reopened';
    toast('Dispute reopened', 'info');
  } else {
    if(confirm(`Resolve dispute ${disputeId}?`)){
      dispute.status = 'Resolved';
      dispute.nextAction = 'Case closed';
      logAudit('Dispute Resolved', `Resolved ${disputeId}`);
      toast('Dispute resolved!', 'success');
    }
  }
  saveData();
  render();
}

function exportDisputeReport(){
  const headers=['Dispute ID','Parcel ID','Type','Status','Filed Date','Description'];
  const rows=data.disputes.map(d=>[d.id,d.parcelId,d.type,d.status,d.date,d.description]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Dispute_Report.csv','text/csv;charset=utf-8');
  logAudit('Export Dispute Report','Exported dispute report');
  toast('Dispute report downloaded.','success');
}

// ============================================
// VIEW: ADMIN DASHBOARD
// ============================================
function viewAdminDashboard(){
  const totalUsers = data.users.length;
  const totalAudit = data.auditLog.length;
  const totalAlerts = data.alerts.length;
  const unacknowledged = data.alerts.filter(a=>!a.acknowledged).length;

  return `
    <div class="section-header">
      <div>
        <h2>🛡️ Admin Dashboard</h2>
        <p class="subtitle">System administration and monitoring</p>
      </div>
    </div>

    <div class="kpi-grid">
      <div class="kpi-card"><div class="kpi-label">Total Users</div><div class="kpi-value">${totalUsers}</div></div>
      <div class="kpi-card"><div class="kpi-label">Audit Logs</div><div class="kpi-value">${totalAudit}</div></div>
      <div class="kpi-card"><div class="kpi-label">Total Alerts</div><div class="kpi-value">${totalAlerts}</div></div>
      <div class="kpi-card"><div class="kpi-label">Unacknowledged</div><div class="kpi-value" style="color:#ef4444;">${unacknowledged}</div></div>
    </div>

    <div class="card">
      <h4>👥 User Management</h4>
      <div class="table-wrap">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${data.users.map(u => `
                <tr>
                  <td><strong>${esc(u.id)}</strong></td>
                  <td>${esc(u.name)}</td>
                  <td><span class="badge badge-info">${esc(u.role)}</span></td>
                  <td>
                    <button class="btn btn-sm btn-secondary" onclick="editUser('${esc(u.id)}')">✏️</button>
                    ${u.id !== 'admin' ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${esc(u.id)}')">🗑️</button>` : ''}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
      <button class="btn btn-primary" onclick="addUser()">+ Add User</button>
    </div>

    <div class="card">
      <h4>📋 Recent Audit Log</h4>
      <div class="table-wrap" style="max-height:300px;overflow-y:auto;">
        <div class="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              ${data.auditLog.slice(-15).reverse().map(a => `
                <tr>
                  <td style="font-size:11px;">${fmtDateTime(a.timestamp)}</td>
                  <td>${esc(a.user)}</td>
                  <td><span class="badge badge-info" style="font-size:9px;">${esc(a.role)}</span></td>
                  <td><strong>${esc(a.action)}</strong></td>
                  <td>${esc(a.detail)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card">
      <h4>📊 System Health</h4>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
        <div><span class="status-dot green"></span> Database: <strong>Online</strong></div>
        <div><span class="status-dot green"></span> API Services: <strong>Healthy</strong></div>
        <div><span class="status-dot green"></span> Storage: <strong>${Math.floor(Math.random()*30+20)}% used</strong></div>
        <div><span class="status-dot green"></span> Last Backup: <strong>${fmtDate(Date.now()-86400000)}</strong></div>
      </div>
    </div>
  `;
}

function initAdminCharts(){}

function addUser(){
  const name = prompt('Enter user name:');
  if(!name || !name.trim()) return;
  const role = prompt('Enter role (Admin/District Officer/Land Acquisition Officer/Field Officer/Citizen):', 'Citizen');
  if(!role || !role.trim()) return;
  const isGovRole = role.trim() !== 'Citizen';

  let newUser;
  if(isGovRole){
    const govId = prompt('Set an Officer ID for login (e.g., LAO-2024-003):');
    if(!govId || !govId.trim()) return;
    if(data.users.some(u=>u.govId===govId.trim())){ toast('That Officer ID is already in use.', 'error'); return; }
    const password = prompt('Set a login password for this officer:');
    if(!password) return;
    let key = prompt('Set a Special Security Key, format XXXX-XXXX-XXXX-XXXX:');
    if(!key) return;
    key = key.trim().toUpperCase();
    if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key)){
      toast('Security key must match format XXXX-XXXX-XXXX-XXXX. User not created.', 'error');
      return;
    }
    newUser = { id: uid('USR'), name: name.trim(), role: role.trim(), type:'gov', govId: govId.trim(), password, securityKey: key };
  } else {
    const email = prompt('Set an email for this citizen account (used to log in):');
    if(!email || !email.trim()) return;
    const normalizedEmail = email.trim().toLowerCase();
    if(data.users.some(u=>(u.email||'').toLowerCase()===normalizedEmail)){ toast('That email is already registered.', 'error'); return; }
    const password = prompt('Set a login password for this account:');
    if(!password) return;
    newUser = { id: uid('USR'), name: name.trim(), role: role.trim(), type:'public', email: normalizedEmail, mobile:'', password, state:'', verified:true };
  }

  data.users.push(newUser);
  logAudit('User Added', `Added ${name} as ${role}`);
  saveData();
  render();
  toast('User added — they can now log in with the credentials you set.', 'success');
}

function editUser(userId){
  const user = data.users.find(u=>u.id===userId);
  if(!user) return;
  const newName = prompt('Enter new name:', user.name);
  if(newName && newName.trim()) {
    user.name = newName.trim();
  }
  const newRole = prompt('Enter role (Admin/District Officer/Land Acquisition Officer/Field Officer/Citizen):', user.role);
  if(newRole && newRole.trim()){
    user.role = newRole.trim();
    user.type = newRole.trim()==='Citizen' ? 'public' : 'gov';
  }
  logAudit('User Updated', `Updated ${userId}`);
  saveData();
  render();
  toast('User updated!', 'success');
}

function deleteUser(userId){
  if(!confirm('Delete this user?')) return;
  data.users = data.users.filter(u=>u.id!==userId);
  logAudit('User Deleted', `Deleted ${userId}`);
  saveData();
  render();
  toast('User deleted!', 'info');
}

// ============================================
// EXPORT FUNCTIONS
// ============================================
function csvEscape(value){
  const v = value == null ? '' : String(value);
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g,'""')}"` : v;
}
function downloadBlob(content, filename, type){
  const blob = new Blob([content], {type});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download=filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  return true;
}
function exportCSV(){
  const headers = ['Survey No','Parcel ID','Location','District','State','Owner','Area','Land Type','Stage','Compensation Status','Risk Score'];
  const rows = data.parcels.map(p => [p.surveyNo,p.id,p.village,p.district,p.state,p.owner,p.area,p.landType,p.acquisitionStage,p.compensationStatus,p.riskScore]);
  downloadBlob([headers,...rows].map(r=>r.map(csvEscape).join(',')).join('\n'),'BhoomiSetu_Parcel_Report.csv','text/csv;charset=utf-8');
  logAudit('Export CSV','Exported parcel report');
  toast('Parcel CSV downloaded.','success');
}
function exportJSON(){
  const report = {
    generatedAt:new Date().toISOString(), source:'BhoomiSetu — National Land Acquisition & Management System (prototype)',
    disclaimer:'Prototype data may be synthetic. Local browser storage is not a centralized government database.',
    summary:{totalParcels:data.parcels.length,totalProjects:data.projects.length,totalArea:data.parcels.reduce((sum,p)=>sum+Number(p.area||0),0),totalCompensation:data.compensations.reduce((sum,c)=>sum+Number(c.sanctionedAmount||0),0)},
    parcels:data.parcels,projects:data.projects,workflows:data.workflows,compensations:data.compensations,grievances:data.grievances,fieldTasks:data.fieldTasks,documents:data.documents.map(d=>({...d,fileData:undefined})),disputes:data.disputes
  };
  downloadBlob(JSON.stringify(report,null,2),'BhoomiSetu_Report.json','application/json;charset=utf-8');
  logAudit('Export JSON','Exported system report');
  toast('JSON report downloaded.','success');
}
function printReport(){
  toast('Print dialog opened — choose “Save as PDF” for a PDF file.','info');
  setTimeout(()=>window.print(),120);
}

// ============================================
// MODAL FUNCTIONS
// ============================================
function closeModal(){
  if(modalChartTimeout) { clearTimeout(modalChartTimeout); modalChartTimeout = null; }
  Object.values(modalCharts).forEach(c => { try { c.destroy(); } catch(e) {} });
  modalCharts = {};
  document.getElementById('modalOverlay').classList.remove('active');
}

function viewHelp(){
  document.getElementById('modalTitle').textContent = '❓ BhoomiSetu Help';
  document.getElementById('modalBody').innerHTML = `
    <h4 style="color:var(--ink-2);">Welcome to BhoomiSetu!</h4>
    <p>The National Land Acquisition & Management System helps digitize the complete land acquisition lifecycle.</p>
    
    <h5 style="margin-top:16px;">🔑 Key Features:</h5>
    <ul style="padding-left:20px;line-height:1.8;">
      <li><strong>Dashboard</strong> - Real-time overview of all acquisition activities</li>
      <li><strong>GIS Map</strong> - Interactive visualization of land parcels</li>
      <li><strong>Parcel Registry</strong> - Complete management of land parcels</li>
      <li><strong>Workflow</strong> - Track acquisition stages and progress</li>
      <li><strong>Compensation</strong> - Manage disbursement and payments</li>
      <li><strong>Grievances</strong> - Public grievance redressal system</li>
      <li><strong>AI Intelligence</strong> - Risk analysis and insights</li>
      <li><strong>Reports</strong> - Comprehensive analytics and exports</li>
    </ul>

    <h5 style="margin-top:16px;">📊 Key Metrics Tracked:</h5>
    <ul style="padding-left:20px;line-height:1.8;">
      <li>Land proposed and acquired</li>
      <li>Notifications issued</li>
      <li>Awards declared</li>
      <li>Compensation assessed and disbursed</li>
      <li>Possession status</li>
      <li>Rehabilitation & Resettlement progress</li>
      <li>Affected families count</li>
      <li>Project-wise and state-wise progress</li>
    </ul>

    <p style="margin-top:16px;color:var(--text-faint);font-size:12px;">📌 Data is stored locally in your browser. Use Reset Demo Data to restore sample data.</p>
  `;
  document.getElementById('modalFooter').innerHTML = `<button class="btn btn-secondary" onclick="closeModal()">Close</button>`;
  document.getElementById('modalOverlay').classList.add('active');
}

// ============================================
// SEED DATA (Enhanced with more realistic data)
// ============================================
function seedData(){
  data = JSON.parse(JSON.stringify(DEFAULT_DATA));

  // Projects
  data.projects = [
    {id:'PRJ-2024-001',name:'Mumbai-Pune Expressway Expansion',agency:'Maharashtra State Road Development Corporation',state:'Maharashtra',district:'Pune',type:'Highway',landRequired:450.5,landAcquired:320.3,parcels:45,compensation:1250.5,currentStage:'CompensationDisbursement',status:'Active',startDate:'2024-01-15',lastUpdated:new Date().toISOString()},
    {id:'PRJ-2024-002',name:'Bengaluru-Chennai Industrial Corridor',agency:'Karnataka Industrial Areas Development Board',state:'Karnataka',district:'Bengaluru Rural',type:'Industrial Corridor',landRequired:1200,landAcquired:680.5,parcels:128,compensation:3450,currentStage:'SurveyMeasurement',status:'Active',startDate:'2024-02-20',lastUpdated:new Date().toISOString()},
    {id:'PRJ-2024-003',name:'Chennai Metro Phase III',agency:'Chennai Metro Rail Limited',state:'Tamil Nadu',district:'Chennai',type:'Urban Development',landRequired:180,landAcquired:145.2,parcels:62,compensation:890,currentStage:'AwardDeclaration',status:'Active',startDate:'2024-03-10',lastUpdated:new Date().toISOString()},
    {id:'PRJ-2024-004',name:'Gujarat Renewable Energy Park',agency:'Gujarat Energy Research and Management Institute',state:'Gujarat',district:'Kutch',type:'Power Infrastructure',landRequired:2500,landAcquired:1850,parcels:215,compensation:4200,currentStage:'PossessionTaken',status:'Active',startDate:'2023-11-15',lastUpdated:new Date().toISOString()},
    {id:'PRJ-2024-005',name:'Jaipur Ring Road',agency:'Rajasthan State Highway Authority',state:'Rajasthan',district:'Jaipur',type:'Highway',landRequired:320,landAcquired:285.5,parcels:78,compensation:650,currentStage:'RehabilitationResettlement',status:'Active',startDate:'2023-09-20',lastUpdated:new Date().toISOString()}
  ];

  // Parcels
  data.parcels = [
    {id:'PCL-MH-PUN-001',surveyNo:'S-245/1',village:'Tathawade',tehsil:'Haveli',district:'Pune',state:'Maharashtra',owner:'Ramesh Patil',area:5.25,landType:'Agricultural',acquisitionStage:'CompensationDisbursement',compensationStatus:'Partial',notificationDate:'2024-03-15',riskScore:65,projectId:'PRJ-2024-001',lat:18.5912,lng:73.7389,lastUpdated:new Date().toISOString()},
    {id:'PCL-MH-PUN-002',surveyNo:'S-312/2',village:'Hinjewadi',tehsil:'Mulshi',district:'Pune',state:'Maharashtra',owner:'Sunita Deshmukh',area:3.8,landType:'Agricultural',acquisitionStage:'AwardDeclaration',compensationStatus:'Pending',notificationDate:'2024-05-20',riskScore:78,projectId:'PRJ-2024-001',lat:18.5679,lng:73.7397,lastUpdated:new Date().toISOString()},
    {id:'PCL-KA-BLR-001',surveyNo:'S-178/3',village:'Devanahalli',tehsil:'Devanahalli',district:'Bengaluru Rural',state:'Karnataka',owner:'Venkatesh Reddy',area:8.5,landType:'Agricultural',acquisitionStage:'SurveyMeasurement',compensationStatus:'Pending',notificationDate:'2024-06-10',riskScore:45,projectId:'PRJ-2024-002',lat:13.267,lng:77.715,lastUpdated:new Date().toISOString()},
    {id:'PCL-KA-BLR-002',surveyNo:'S-089/1',village:'Sarjapur',tehsil:'Anekal',district:'Bengaluru Urban',state:'Karnataka',owner:'Lakshmi Narayan',area:4.2,landType:'Residential',acquisitionStage:'SocialImpactAssessment',compensationStatus:'Pending',notificationDate:'2024-07-05',riskScore:52,projectId:'PRJ-2024-002',lat:12.901,lng:77.715,lastUpdated:new Date().toISOString()},
    {id:'PCL-TN-CHN-001',surveyNo:'S-456/2',village:'Tambaram',tehsil:'Tambaram',district:'Chennai',state:'Tamil Nadu',owner:'Karthik Subramanian',area:2.15,landType:'Commercial',acquisitionStage:'AwardDeclaration',compensationStatus:'Paid',notificationDate:'2024-02-28',riskScore:25,projectId:'PRJ-2024-003',lat:12.9249,lng:80.1,lastUpdated:new Date().toISOString()},
    {id:'PCL-GJ-KTC-001',surveyNo:'S-234/1',village:'Bhuj',tehsil:'Bhuj',district:'Kutch',state:'Gujarat',owner:'Gopal Sharma',area:12.5,landType:'Industrial',acquisitionStage:'PossessionTaken',compensationStatus:'Paid',notificationDate:'2023-11-15',riskScore:15,projectId:'PRJ-2024-004',lat:23.242,lng:69.6669,lastUpdated:new Date().toISOString()},
    {id:'PCL-RJ-JPR-001',surveyNo:'S-567/3',village:'Sitapura',tehsil:'Sanganer',district:'Jaipur',state:'Rajasthan',owner:'Mahendra Singh',area:6.75,landType:'Agricultural',acquisitionStage:'RehabilitationResettlement',compensationStatus:'Paid',notificationDate:'2023-09-20',riskScore:20,projectId:'PRJ-2024-005',lat:26.8467,lng:75.8064,lastUpdated:new Date().toISOString()},
    {id:'PCL-MH-PUN-003',surveyNo:'S-123/4',village:'Wakad',tehsil:'Mulshi',district:'Pune',state:'Maharashtra',owner:'Priya Kulkarni',area:4.5,landType:'Residential',acquisitionStage:'PreliminaryNotification',compensationStatus:'Pending',notificationDate:'2024-08-01',riskScore:85,projectId:'PRJ-2024-001',lat:18.5975,lng:73.7639,lastUpdated:new Date().toISOString()},
    {id:'PCL-KA-BLR-003',surveyNo:'S-789/1',village:'Yelahanka',tehsil:'Yelahanka',district:'Bengaluru Urban',state:'Karnataka',owner:'Anita Gowda',area:7.25,landType:'Agricultural',acquisitionStage:'ObjectionHearing',compensationStatus:'Pending',notificationDate:'2024-04-18',riskScore:72,projectId:'PRJ-2024-002',lat:13.1007,lng:77.5963,lastUpdated:new Date().toISOString()},
    {id:'PCL-TN-CHN-002',surveyNo:'S-345/2',village:'Poonamallee',tehsil:'Poonamallee',district:'Chennai',state:'Tamil Nadu',owner:'Rajesh Kumar',area:3.6,landType:'Commercial',acquisitionStage:'CompensationDisbursement',compensationStatus:'Partial',notificationDate:'2024-01-10',riskScore:38,projectId:'PRJ-2024-003',lat:13.0358,lng:80.0963,lastUpdated:new Date().toISOString()}
  ];

  // Workflows
  data.workflows = data.parcels.map((p,i) => ({
    id: uid('WF'),
    parcelId: p.id,
    projectId: p.projectId,
    currentStage: p.acquisitionStage,
    assignedOfficer: 'Officer '+String.fromCharCode(65+(i%5)),
    fieldTeam: 'Team '+(i%3+1),
    notificationDate: p.notificationDate,
    daysPending: daysSince(p.notificationDate),
    riskLevel: p.riskScore>70?'High':p.riskScore>50?'Medium':'Low',
    nextAction: 'Conduct Social Impact Assessment'
  }));

  // Compensations
  data.compensations = data.parcels.map((p,i) => {
    const sanctioned = Math.round(p.area*(2+Math.random()*3)*10000000);
    const disbursed = p.compensationStatus==='Paid'?sanctioned:p.compensationStatus==='Partial'?Math.round(sanctioned*0.6):0;
    return {
      id: uid('COMP'),
      parcelId: p.id,
      projectId: p.projectId,
      surveyNo: p.surveyNo,
      interestedParty: p.owner,
      sanctionedAmount: sanctioned,
      disbursedAmount: disbursed,
      pendingAmount: sanctioned-disbursed,
      paymentStatus: p.compensationStatus,
      paymentReference: '',
      date: p.notificationDate,
      remarks: 'Indicative estimate — not a substitute for statutory assessment'
    };
  });

  // Field Tasks
  data.fieldTasks = [
    {id:'TSK-001',projectId:'PRJ-2024-001',parcelId:'PCL-MH-PUN-001',surveyNo:'S-245/1',location:'Tathawade, Pune',team:'Team 1',type:'Land Survey',priority:'High',dueDate:'2024-09-15',status:'In Progress'},
    {id:'TSK-002',projectId:'PRJ-2024-002',parcelId:'PCL-KA-BLR-001',surveyNo:'S-178/3',location:'Devanahalli, Bengaluru',team:'Team 2',type:'Boundary Verification',priority:'Medium',dueDate:'2024-09-20',status:'Pending'},
    {id:'TSK-003',projectId:'PRJ-2024-003',parcelId:'PCL-TN-CHN-001',surveyNo:'S-456/2',location:'Tambaram, Chennai',team:'Team 3',type:'Document Verification',priority:'Low',dueDate:'2024-09-10',status:'Completed'},
    {id:'TSK-004',projectId:'PRJ-2024-004',parcelId:'PCL-GJ-KTC-001',surveyNo:'S-234/1',location:'Bhuj, Kutch',team:'Team 1',type:'GPS/GIS Verification',priority:'High',dueDate:'2024-09-05',status:'Overdue'},
    {id:'TSK-005',projectId:'PRJ-2024-005',parcelId:'PCL-RJ-JPR-001',surveyNo:'S-567/3',location:'Sitapura, Jaipur',team:'Team 2',type:'Physical Inspection',priority:'Medium',dueDate:'2024-09-18',status:'In Progress'}
  ];

  // Grievances
  data.grievances = [
    {id:'GRV-001',parcelId:'PCL-MH-PUN-002',applicantName:'Sunita Deshmukh',category:'Compensation Delay',date:'2024-07-15',priority:'High',status:'Open',assignedOfficer:'Officer A',deadline:'2024-09-15'},
    {id:'GRV-002',parcelId:'PCL-KA-BLR-002',applicantName:'Lakshmi Narayan',category:'Ownership Issue',date:'2024-06-20',priority:'Medium',status:'Under Review',assignedOfficer:'Officer B',deadline:'2024-09-20'},
    {id:'GRV-003',parcelId:'PCL-TN-CHN-002',applicantName:'Rajesh Kumar',category:'Measurement Dispute',date:'2024-05-10',priority:'Low',status:'Resolved',assignedOfficer:'Officer C',deadline:'2024-08-10'},
    {id:'GRV-004',parcelId:'PCL-MH-PUN-003',applicantName:'Priya Kulkarni',category:'Documentation',date:'2024-08-05',priority:'High',status:'Open',assignedOfficer:'Officer A',deadline:'2024-09-25'}
  ];

  // Documents
  data.documents = [
    {id:'DOC-001',parcelId:'PCL-MH-PUN-001',projectId:'PRJ-2024-001',type:'Land Record',uploadedBy:'Officer A',date:'2024-03-20',verificationStatus:'Verified'},
    {id:'DOC-002',parcelId:'PCL-MH-PUN-001',projectId:'PRJ-2024-001',type:'Acquisition Notification',uploadedBy:'Officer A',date:'2024-03-15',verificationStatus:'Verified'},
    {id:'DOC-003',parcelId:'PCL-KA-BLR-001',projectId:'PRJ-2024-002',type:'Survey Report',uploadedBy:'Officer B',date:'2024-06-15',verificationStatus:'Pending'},
    {id:'DOC-004',parcelId:'PCL-TN-CHN-001',projectId:'PRJ-2024-003',type:'Award Document',uploadedBy:'Officer C',date:'2024-03-05',verificationStatus:'Verified'},
    {id:'DOC-005',parcelId:'PCL-GJ-KTC-001',projectId:'PRJ-2024-004',type:'Possession Document',uploadedBy:'Officer D',date:'2024-01-10',verificationStatus:'Verified'}
  ];

  // Disputes
  data.disputes = [
    {id:'DSP-001',parcelId:'PCL-MH-PUN-002',surveyNo:'S-312/2',category:'Compensation Dispute',filedDate:'2024-06-01',status:'Under Review',assignedOfficer:'Officer A',priority:'High',nextAction:'Hearing scheduled'},
    {id:'DSP-002',parcelId:'PCL-KA-BLR-002',surveyNo:'S-089/1',category:'Ownership Dispute',filedDate:'2024-05-15',status:'Open',assignedOfficer:'Officer B',priority:'Medium',nextAction:'Document verification'}
  ];

  // Alerts
  data.alerts = [
    {id:'ALT-001',type:'Compensation Overdue',message:'3 compensation cases pending for more than 90 days',severity:'high',acknowledged:false,date:'2024-09-01'},
    {id:'ALT-002',type:'High Risk Parcel',message:'PCL-MH-PUN-003 identified as high-risk requiring immediate attention',severity:'high',acknowledged:false,date:'2024-09-05',parcelId:'PCL-MH-PUN-003'},
    {id:'ALT-003',type:'Overdue Task',message:'TSK-004 overdue for completion',severity:'medium',acknowledged:false,date:'2024-09-08',parcelId:'PCL-GJ-KTC-001'},
    {id:'ALT-004',type:'Stalled Proceeding',message:'PCL-KA-BLR-001 pending for 95 days',severity:'medium',acknowledged:false,date:'2024-09-07',parcelId:'PCL-KA-BLR-001'}
  ];

  // Users
  data.users = [
    {id:'admin',role:'Admin',name:'System Administrator',type:'gov'},
    {id:'officer1',role:'District Officer',name:'District Collector',type:'gov'},
    {id:'officer2',role:'Land Acquisition Officer',name:'LAO Mumbai',type:'gov'},
    {id:'field1',role:'Field Officer',name:'Field Surveyor',type:'gov'},
    {id:'user1',role:'Citizen',name:'Ramesh Kumar',type:'public',email:'user@example.com',password:'user123'}
  ];

  // Audit Log
  data.auditLog = [
    {id:'AUD-001',user:'System Administrator',role:'Admin',action:'System Initialized',detail:'BhoomiSetu v2.0 started',timestamp:new Date().toISOString()}
  ];

  saveData();
}

// ============================================
// RESET FUNCTION
// ============================================
function resetDemo(){
  showConfirmDialog('Reset all data to demo defaults? This will erase all custom changes.', () => {
    localStorage.removeItem('bhoomiSetuData');
    seedData();
    data = JSON.parse(localStorage.getItem('bhoomiSetuData'));
    render();
    toast('Demo data restored!', 'success');
  });
}

// Custom confirmation helper for sandboxed/embedded environments where native
// browser confirm() dialogs may be blocked. Existing action logic remains unchanged.
let confirmDialogCallback = null;
function showConfirmDialog(message, onConfirm){
  confirmDialogCallback = typeof onConfirm === 'function' ? onConfirm : null;
  const msg = document.getElementById('confirmMessage');
  const overlay = document.getElementById('confirmOverlay');
  if(!msg || !overlay){ if(confirm(message) && confirmDialogCallback) confirmDialogCallback(); confirmDialogCallback=null; return; }
  msg.textContent = message;
  overlay.classList.add('active');
}
function confirmDialogResolve(confirmed){
  const callback = confirmDialogCallback;
  confirmDialogCallback = null;
  const overlay = document.getElementById('confirmOverlay');
  if(overlay) overlay.classList.remove('active');
  if(confirmed && callback) callback();
}

// ============================================
// INITIALIZATION
// ============================================
if(!localStorage.getItem('bhoomiSetuData')){
  seedData();
} else {
  try { data = JSON.parse(localStorage.getItem('bhoomiSetuData')); }
  catch(err) { console.warn('Saved BhoomiSetu data was invalid; restoring defaults.'); data = JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  data = {...DEFAULT_DATA, ...data};
  // Ensure all required fields exist (migration safety for older saved data)
  if(!data.users || !data.users.length) data.users = JSON.parse(JSON.stringify(DEFAULT_DATA.users));
  data.users.forEach(u => {
    if(!u.type) u.type = (u.role === 'Citizen') ? 'public' : 'gov';
  });
  if(!data.auditLog) data.auditLog = [];
  if(!data.notifications) data.notifications = [];
}

// Auto-refresh data every 60 seconds
autoRefreshInterval = setInterval(() => {
  // Only refresh if data hasn't changed
  const saved = localStorage.getItem('bhoomiSetuData');
  if(saved) {
    const newData = JSON.parse(saved);
    // Merge any changes from localStorage
    Object.keys(newData).forEach(key => {
      if(Array.isArray(newData[key]) && JSON.stringify(data[key]) !== JSON.stringify(newData[key])) {
        data[key] = newData[key];
      }
    });
  }
}, 60000);

render();

// Handle window resize for responsive charts
window.addEventListener('resize', () => {
  Object.values(charts).forEach(c => { try { c.resize(); } catch(e) {} });
  Object.values(reportCharts).forEach(c => { try { c.resize(); } catch(e) {} });
});

console.log('🚀 BhoomiSetu v2.0 loaded successfully!');
console.log(`📊 ${data.parcels.length} parcels, ${data.projects.length} projects, ${data.compensations.length} compensation cases`);
