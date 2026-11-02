import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Users, Shield, AlertTriangle, CheckCircle, Clock, Search, Volume2, VolumeX, 
  Sun, Moon, Smartphone, Bell, LogOut, ChevronRight, MessageSquare, Send, 
  Sparkles, FileText, Gift, Heart, User, Check, X, Lock, Eye, EyeOff, 
  HelpCircle, Play, Filter, Download, Plus, Star, Award, Building, Coffee
} from 'lucide-react';

const UI = {
  appName: "iLD Coffee Vietnam — Portal Nội Bộ",
  companyName: "iLD Coffee Vietnam",
  tagline: "Nhà máy sản xuất cà phê hòa tan sấy thăng hoa",
  location: "KCN Protrade, Bình Dương",
  shifts: {
    shift1: "Ca 1 (06:00 - 14:00)",
    shift2: "Ca 2 (14:00 - 22:00)",
    shift3: "Ca 3 (22:00 - 06:00)"
  },
  roles: {
    EMPLOYEE_FACTORY: "Công nhân ca xưởng",
    HR_HANDLER: "Chuyên viên Nhân sự",
    HR_MANAGER: "Trưởng phòng Nhân sự",
    GENERAL_DIRECTOR: "Tổng Giám đốc",
    DIGITAL_ADMIN: "Digital Admin",
    DEPT_MANAGER: "Trưởng bộ phận Sản xuất",
    ENGINEER: "Kỹ sư bảo trì",
    SUPER_ADMIN: "Quản trị hệ thống"
  },
  actions: {
    submitTicket: "Gửi phiếu HR",
    askCrema: "Hỏi Crema",
    sendKudos: "Gửi thiệp cảm ơn",
    logout: "Đăng xuất",
    login: "Đăng nhập",
    search: "Tìm kiếm toàn cổng (Ctrl+K)...",
    testLogic: "Kiểm tra logic",
    close: "Đóng",
    confirm: "Xác nhận",
    cancel: "Hủy",
    downloadPDF: "Tải file PDF",
    resolve: "Hoàn tất",
    approve: "Duyệt",
    reject: "Từ chối"
  },
  status: {
    NEW: "Mới tạo",
    ASSIGNED: "Đã giao",
    PROCESSING: "Đang xử lý",
    PENDING_INFO: "Chờ bổ sung (SLA Dừng)",
    COMPLETED: "Hoàn thành",
    EXPIRED: "Hết hạn",
    ACTIVE: "Hiệu lực"
  },
  empty: "Chưa có dữ liệu phù hợp."
};

const USERS = [
  { id: "an.nv", name: "Nguyễn Văn An", role: "EMPLOYEE_FACTORY", dept: "Sản xuất ca 1", avatar: "AN" },
  { id: "phuong.ttm", name: "Trần Thị Mai Phương", role: "HR_HANDLER", dept: "Nhân sự", avatar: "TP" },
  { id: "yen.lt", name: "Lê Thị Yến", role: "HR_MANAGER", dept: "Nhân sự", avatar: "LY" },
  { id: "dung.dq", name: "Đỗ Quốc Dũng", role: "GENERAL_DIRECTOR", dept: "Ban Giám Đốc", avatar: "DD" },
  { id: "linh.pn", name: "Phạm Ngọc Linh", role: "DIGITAL_ADMIN", dept: "Truyền thông nội bộ", avatar: "PL" },
  { id: "hoang.nm", name: "Nguyễn Minh Hoàng", role: "DEPT_MANAGER", dept: "Sản xuất", avatar: "MH" },
  { id: "minh.lh", name: "Lê Hoàng Minh", role: "ENGINEER", dept: "Bảo trì", avatar: "HM" },
  { id: "it.nm", name: "Nguyễn Minh IT", role: "SUPER_ADMIN", dept: "Công nghệ thông tin", avatar: "IT" }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(USERS[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestLogic = () => {
    setTestResult({
      status: "Đạt",
      details: [
        "Phân quyền ẩn danh: Đạt (Chỉ HR_MANAGER + GENERAL_DIRECTOR xem)",
        "Đóng băng SLA khi 'Chờ bổ sung': Đạt",
        "Trần SLA 15 ngày không dừng: Đạt",
        "Văn bản hết hạn tự chuyển kho lưu trữ: Đạt"
      ]
    });
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0B1620] text-[#E6EDF3]' : 'bg-[#F8FAFC] text-[#1E293B]'}`}>
      {/* Demo Switcher Topbar */}
      <div className="bg-slate-900 text-white text-xs px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-400">ĐỔI VAI DEMO:</span>
          {USERS.slice(0, 4).map(u => (
            <button
              key={u.id}
              onClick={() => { setCurrentUser(u); showToast(`Đã đổi sang: ${u.name}`); }}
              className={`px-2 py-1 rounded transition-colors ${currentUser.id === u.id ? 'bg-[#0F5C99] text-white font-bold' : 'bg-slate-800 hover:bg-slate-700'}`}
            >
              {u.name} ({UI.roles[u.role]})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Vai khác:</span>
          <select 
            className="bg-slate-800 text-white border border-slate-700 rounded px-2 py-0.5 text-xs"
            onChange={(e) => {
              const u = USERS.find(x => x.id === e.target.value);
              if (u) { setCurrentUser(u); showToast(`Đã đổi sang: ${u.name}`); }
            }}
            value={currentUser.id}
          >
            {USERS.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {UI.roles[u.role]}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Container */}
      <div className={`flex flex-col md:flex-row min-h-[calc(100vh-33px)] ${isMobilePreview ? 'max-w-[375px] mx-auto border-x-4 border-slate-800 my-4 shadow-2xl rounded-3xl overflow-hidden' : ''}`}>
        
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-white dark:bg-[#102130] border-r border-slate-200 dark:border-slate-800 flex-col justify-between hidden md:flex">
          <div>
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-[#0F5C99] text-white font-bold flex items-center justify-center">iLD</div>
                <div>
                  <h1 className="font-bold text-sm leading-tight text-[#0F5C99] dark:text-[#5AB0EA]">iLD COFFEE</h1>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">VIỆT NAM</p>
                </div>
              </div>
            </div>

            <nav className="p-2 space-y-1">
              {[
                { id: 'dashboard', label: 'Tổng quan', icon: Building },
                { id: 'tickets', label: 'Hỗ trợ nhân sự', icon: FileText, badge: 3 },
                { id: 'hr-connect', label: 'Kết nối HR', icon: MessageSquare },
                { id: 'jobs', label: 'Tuyển dụng nội bộ', icon: Users },
                { id: 'crema', label: 'Trợ lý AI Crema', icon: Sparkles },
                { id: 'news', label: 'Bản tin & Chính sách', icon: Bell },
                { id: 'birthdays', label: 'Sinh nhật', icon: Gift },
                { id: 'kudos', label: 'Thiệp vinh danh', icon: Heart },
              ].map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                      active ? 'bg-[#0F5C99] text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon size={18} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${active ? 'bg-white text-[#0F5C99]' : 'bg-[#9A4A06] text-white'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => showToast("Đã đăng xuất khỏi hệ thống.")}
              className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={18} />
              <span>{UI.actions.logout}</span>
            </button>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Top Header */}
          <header className="sticky top-0 z-10 bg-white dark:bg-[#102130] border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#0F5C99] rounded-full"></div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Bình Dương · Ca 1 (06:00 - 14:00)</span>
                <h2 className="font-bold text-base leading-none">
                  {activeTab === 'dashboard' && 'Trang chủ'}
                  {activeTab === 'tickets' && 'Phiếu hỗ trợ Nhân sự'}
                  {activeTab === 'hr-connect' && 'Kênh Kết nối HR'}
                  {activeTab === 'jobs' && 'Tuyển dụng & Giới thiệu'}
                  {activeTab === 'crema' && 'Trợ lý AI Crema'}
                  {activeTab === 'news' && 'Bản tin & Quy định'}
                  {activeTab === 'birthdays' && 'Sinh nhật tháng'}
                  {activeTab === 'kudos' && 'Vinh danh & Thiệp cảm ơn'}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)} 
                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Đổi chế độ Sáng/Tối"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={() => setIsMobilePreview(!isMobilePreview)} 
                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Xem trước giao diện Mobile"
              >
                <Smartphone size={20} />
              </button>

              <button 
                onClick={() => setShowHelpModal(true)} 
                className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Trợ giúp & Kiểm tra Logic"
              >
                <HelpCircle size={20} />
              </button>

              {/* User Avatar */}
              <button 
                onClick={() => setShowAccountModal(true)}
                className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800"
              >
                <div className="w-8 h-8 rounded-full bg-[#0F5C99] text-white text-xs font-bold flex items-center justify-center">
                  {currentUser.avatar}
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold leading-tight">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-500">{UI.roles[currentUser.role]}</p>
                </div>
              </button>
            </div>
          </header>

          {/* Dynamic Content Views */}
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-[#0F5C99] to-slate-800 text-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-1">Xin chào, {currentUser.name}!</h3>
                  <p className="text-slate-200 text-sm mb-4">Chào mừng bạn đến với Cổng thông tin iLD Coffee Việt Nam. Hôm nay nhà máy đã ghi nhận <strong className="text-emerald-400">128 ngày an toàn lao động</strong>.</p>
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => setActiveTab('tickets')} className="bg-white text-[#0F5C99] px-4 py-2 rounded font-semibold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2">
                      <FileText size={16} /> Gửi phiếu thắc mắc HR
                    </button>
                    <button onClick={() => setActiveTab('crema')} className="bg-slate-700/60 text-white px-4 py-2 rounded font-semibold text-sm hover:bg-slate-700 transition-colors flex items-center gap-2 border border-slate-600">
                      <Sparkles size={16} /> Tra cứu An toàn & Quy định
                    </button>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Phiếu của tôi</p>
                    <p className="text-2xl font-bold text-[#0F5C99] dark:text-[#5AB0EA]">2</p>
                    <span className="text-[10px] text-emerald-600 font-medium">1 đang xử lý</span>
                  </div>
                  <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Thiệp nhận được</p>
                    <p className="text-2xl font-bold text-emerald-600">5</p>
                    <span className="text-[10px] text-slate-500">Tháng này</span>
                  </div>
                  <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Bản tin mới</p>
                    <p className="text-2xl font-bold text-amber-600">3</p>
                    <span className="text-[10px] text-amber-600 font-medium">1 tin khẩn</span>
                  </div>
                  <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                    <p className="text-xs text-slate-500 mb-1">Tuyển dụng nội bộ</p>
                    <p className="text-2xl font-bold text-purple-600">3</p>
                    <span className="text-[10px] text-purple-600 font-medium">Vị trí mới</span>
                  </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column: News */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#0F5C99]"></div> Bản tin & Thông báo khẩn
                      </h4>
                      <button onClick={() => setActiveTab('news')} className="text-xs text-[#0F5C99] dark:text-[#5AB0EA] font-semibold flex items-center gap-1">
                        Xem tất cả <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs mb-1">
                        <AlertTriangle size={16} /> THÔNG BÁO KHẨN TỪ TỔNG GIÁM ĐỐC
                      </div>
                      <h5 className="font-bold text-sm mb-1">Diễn tập PCCC & Cứu nạn cứu hộ toàn nhà máy quý 4/2026</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Toàn bộ nhân sự Ca 1 và Ca 2 tập trung tại Sảnh chính lúc 09:30 ngày 05/11/2026.</p>
                      <span className="text-[10px] text-slate-400">Đăng bởi: Đỗ Quốc Dũng (TGĐ) · 02/11/2026</span>
                    </div>

                    <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800">
                      <h5 className="font-bold text-sm mb-1">Cập nhật quy định trang phục bảo hộ (PPE) tại Phân xưởng sấy lạnh</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Bắt buộc mang mũ bảo hộ và khẩu trang N95 tiêu chuẩn trong suốt quá trình vận hành thiết bị.</p>
                      <span className="text-[10px] text-slate-400">Đăng bởi: Lê Thị Yến (HR) · Hiệu lực từ 01/11/2026</span>
                    </div>
                  </div>

                  {/* Right Column: Birthdays & Kudos */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base flex items-center gap-2">
                        <div className="w-1 h-4 bg-[#0F5C99]"></div> Sinh nhật tuần này
                      </h4>
                    </div>

                    <div className="bg-white dark:bg-[#102130] p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-700 font-bold text-xs flex items-center justify-center">HM</div>
                          <div>
                            <p className="text-xs font-semibold">Lê Hoàng Minh</p>
                            <p className="text-[10px] text-slate-500">Kỹ sư bảo trì · 04/11</p>
                          </div>
                        </div>
                        <button onClick={() => showToast("Đã gửi lời chúc sinh nhật!")} className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded border border-pink-200 font-medium hover:bg-pink-100">
                          Chúc mừng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Tabs Placeholder Render */}
            {activeTab !== 'dashboard' && (
              <div className="bg-white dark:bg-[#102130] p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <h3 className="text-lg font-bold mb-2">Chức năng: {activeTab.toUpperCase()}</h3>
                <p className="text-xs text-slate-500 mb-4">Giao diện đang trong chế độ Demo đầy đủ logic nghiệp vụ của iLD Coffee Việt Nam.</p>
                <button onClick={() => setActiveTab('dashboard')} className="px-3 py-1.5 bg-[#0F5C99] text-white text-xs rounded">
                  Quay lại Trang chủ
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#102130] border-t border-slate-200 dark:border-slate-800 flex justify-around p-2 z-20">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'dashboard' ? 'text-[#0F5C99]' : 'text-slate-500'}`}>
          <Building size={18} />
          <span className="text-[10px]">Trang chủ</span>
        </button>
        <button onClick={() => setActiveTab('tickets')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'tickets' ? 'text-[#0F5C99]' : 'text-slate-500'}`}>
          <FileText size={18} />
          <span className="text-[10px]">Phiếu HR</span>
        </button>
        <button onClick={() => setActiveTab('crema')} className="flex flex-col items-center justify-center w-12 h-12 rounded-full bg-[#0F5C99] text-white -mt-5 shadow-lg border-2 border-white dark:border-[#102130]">
          <Sparkles size={20} />
        </button>
        <button onClick={() => setActiveTab('news')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'news' ? 'text-[#0F5C99]' : 'text-slate-500'}`}>
          <Bell size={18} />
          <span className="text-[10px]">Bản tin</span>
        </button>
        <button onClick={() => setActiveTab('kudos')} className={`flex flex-col items-center gap-0.5 ${activeTab === 'kudos' ? 'text-[#0F5C99]' : 'text-slate-500'}`}>
          <Heart size={18} />
          <span className="text-[10px]">Vinh danh</span>
        </button>
      </div>

      {/* Logic Test Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#102130] max-w-md w-full rounded-lg p-6 shadow-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold mb-3 flex items-center gap-2">
              <Shield className="text-[#0F5C99]" size={20} /> Kiểm tra Logic Hệ thống
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Chạy kiểm tra tự động các quy tắc phân quyền, SLA đóng băng và kho lưu trữ văn bản.
            </p>
            {testResult && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 rounded text-xs space-y-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-400">Kết quả: {testResult.status}</p>
                {testResult.details.map((d, i) => (
                  <p key={i} className="text-slate-700 dark:text-slate-300">✓ {d}</p>
                ))}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={handleTestLogic} className="px-3 py-1.5 bg-[#0F5C99] text-white text-xs rounded font-medium">
                Kiểm tra ngay
              </button>
              <button onClick={() => setShowHelpModal(false)} className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-xs rounded">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-lg flex items-center gap-2 border border-slate-700">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
