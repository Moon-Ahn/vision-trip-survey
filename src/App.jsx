import React, { useState } from 'react';
import { 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Globe, 
  Calendar, 
  Star, 
  Sprout, 
  Users, 
  MessageSquare, 
  HelpCircle, 
  Loader2,
  Phone,
  User
} from 'lucide-react';

const App = () => {
  const [step, setStep] = useState(0); // 0: 시작, 1: 참여여부, 2: 상세질문/사유, 3: 마무리, 4: 완료
  const [participate, setParticipate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    country: '',
    duration: '',
    talents: [],
    spiritualFruit: [],
    ministryType: '',
    training: '',
    reason: '',
    suggestions: ''
  });

  // 중요: Google Apps Script 배포 후 받은 웹 앱 URL을 여기에 넣으세요.
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwqp-7Ln7j5AL8HbeSe3lNHzAyHWU1sbO1kwlb-s6x0flnaxIxE6gqhv2rHsge1IdGh/exec";

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => {
      const current = prev[category];
      const next = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const handleParticipation = (val) => {
    setParticipate(val);
    nextStep();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // CORS 이슈 방지를 위해 'no-cors' 모드를 사용할 수 있으나, 
      // Apps Script 결과 확인을 위해 기본 fetch를 사용합니다.
      // 실제 환경에서는 redirect를 따르도록 설정됩니다.
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Apps Script POST 시 필수 설정인 경우가 많음
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, participate }),
      });
      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주하고 진행
      setStep(4);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("데이터 전송 중 오류가 발생했습니다. 네트워크 상태를 확인해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: // 시작 페이지
        return (
          <div className="space-y-6 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="text-blue-600 w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">2026 청년부 비전트립 수요조사</h1>
            <p className="text-gray-600 leading-relaxed text-sm">
              안녕하세요, 이음청년부 동역자 여러분!<br />
              하나님의 마음을 품고 열방을 향해 나아가는 비전트립 수요조사를 하고있습니다.
              여러분의 소중한 의견을 통해 더 풍성한 선교의 장을 마련하고자 하오니, 
              정성껏 답변을 부탁드립니다❤️
            </p>
            <div className="space-y-3 pt-4 text-left">
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="name" 
                  placeholder="이름" 
                  value={formData.name}
                  className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={handleInputChange}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="연락처 (010-0000-0000)" 
                  value={formData.phone}
                  className="w-full p-3 pl-10 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <button 
              onClick={nextStep}
              disabled={!formData.name || !formData.phone}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-200"
            >
              설문 시작하기
            </button>
          </div>
        );

      case 1: // 참여 의사
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <HelpCircle className="text-blue-500" />
              비전트립이 진행된다면 참여하시겠습니까?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => handleParticipation(true)}
                className={`p-6 border-2 rounded-2xl flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 transition ${participate === true ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}
              >
                <span className="text-3xl">🙌</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800">예, 참여하겠습니다</p>
                  <p className="text-xs text-gray-500">하나님의 마음을 품고 기도로 준비할게요.</p>
                </div>
              </button>
              <button 
                onClick={() => handleParticipation(false)}
                className={`p-6 border-2 rounded-2xl flex items-center gap-4 hover:border-gray-500 hover:bg-gray-50 transition ${participate === false ? 'border-gray-500 bg-gray-50' : 'border-gray-100'}`}
              >
                <span className="text-3xl">🙏</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800">아니오, 어렵습니다</p>
                  <p className="text-xs text-gray-500">마음으로 함께 기도하며 후원할게요.</p>
                </div>
              </button>
            </div>
            <button onClick={prevStep} className="w-full py-3 text-gray-500 font-medium">이전 단계로</button>
          </div>
        );

      case 2: // 분기 섹션 (참여/불참 상세)
        if (participate) {
          return (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-4">
                <label className="font-bold flex items-center gap-2 text-gray-700"><Globe size={18} className="text-blue-500"/> 희망하는 국가</label>
                <input 
                  type="text" 
                  name="country"
                  placeholder="예: 캄보디아, 일본, 태국 등"
                  className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-4">
                <label className="font-bold flex items-center gap-2 text-gray-700"><Calendar size={18} className="text-blue-500"/> 선호 기간</label>
                <div className="grid grid-cols-2 gap-2">
                  {['3박 4일', '4박 5일', '5박 6일', '일주일 이상'].map(d => (
                    <button 
                      key={d}
                      onClick={() => setFormData({...formData, duration: d})}
                      className={`p-3 border rounded-xl text-sm font-medium transition ${formData.duration === d ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-600 border-gray-100'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-bold flex items-center gap-2 text-gray-700"><Star size={18} className="text-blue-500"/> 기여할 수 있는 달란트 (중복)</label>
                <div className="flex flex-wrap gap-2">
                  {['찬양/악기', '영상/기록', '디자인/홍보', '어린이사역', '외국어', '행정/회계', '요리'].map(t => (
                    <button 
                      key={t}
                      onClick={() => handleCheckboxChange('talents', t)}
                      className={`px-4 py-2 border rounded-full text-xs font-semibold transition ${formData.talents.includes(t) ? 'bg-blue-100 border-blue-600 text-blue-700' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-bold flex items-center gap-2 text-gray-700"><Sprout size={18} className="text-green-500"/> 기대하는 영적 열매</label>
                <div className="flex flex-wrap gap-2">
                  {['신앙 회복', '선교 사명', '공동체 친밀감', '긍휼의 마음', '비전 발견'].map(f => (
                    <button 
                      key={f}
                      onClick={() => handleCheckboxChange('spiritualFruit', f)}
                      className={`px-4 py-2 border rounded-full text-xs font-semibold transition ${formData.spiritualFruit.includes(f) ? 'bg-green-100 border-green-600 text-green-700' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="font-bold flex items-center gap-2 text-gray-700"><Users size={18} className="text-blue-500"/> 희망 사역 형태</label>
                <textarea 
                  name="ministryType"
                  placeholder="예: 어린이 사역, 찬양 사역, 노방 전도 등"
                  className="w-full p-3 border rounded-xl h-24 outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={handleInputChange}
                ></textarea>
              </div>

              <div className="space-y-4">
                <label className="font-bold text-gray-700 block">사전 훈련(4~8주) 참여 가능 여부</label>
                <div className="flex gap-2">
                  {['참여 가능', '조율 필요', '어려움'].map(v => (
                    <button 
                      key={v}
                      onClick={() => setFormData({...formData, training: v})}
                      className={`flex-1 p-3 border rounded-xl text-xs font-bold transition ${formData.training === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-100'}`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3 pb-4">
                <button onClick={prevStep} className="flex-1 py-4 border-2 rounded-2xl font-bold text-gray-400">이전</button>
                <button onClick={nextStep} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">다음 단계</button>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h2 className="text-xl font-bold text-gray-800 leading-tight">참여를 망설이게 하는<br />가장 큰 요인은 무엇인가요?</h2>
              <div className="space-y-2">
                {['경제적 부담 (비용)', '직장/학업 일정 조율', '건강 및 체력', '사전 훈련 기간 부담', '선교에 대한 확신 부족'].map(r => (
                  <button 
                    key={r}
                    onClick={() => setFormData({...formData, reason: r})}
                    className={`w-full p-4 border-2 rounded-xl text-left text-sm font-medium transition ${formData.reason === r ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-50 text-gray-600 hover:border-gray-200'}`}
                  >
                    {r}
                  </button>
                ))}
                <input 
                  type="text" 
                  placeholder="기타 사유 직접 입력" 
                  className="w-full p-4 border-2 border-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button onClick={prevStep} className="flex-1 py-4 border-2 rounded-2xl font-bold text-gray-400">이전</button>
                <button onClick={nextStep} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">다음 단계</button>
              </div>
            </div>
          );
        }

      case 3: // 건의사항 및 제출
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800">
              <MessageSquare className="text-blue-500" />
              마지막으로 한마디
            </h2>
            <p className="text-sm text-gray-500">건의사항이나 선교팀이 함께 기도했으면 하는 기도제목을 적어주세요.</p>
            <textarea 
              name="suggestions"
              placeholder="자유롭게 작성해 주세요..."
              className="w-full p-4 border rounded-2xl h-48 outline-none focus:ring-2 focus:ring-blue-500 transition"
              onChange={handleInputChange}
            ></textarea>
            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 py-4 border-2 rounded-2xl font-bold text-gray-400" disabled={isSubmitting}>이전</button>
              <button 
                onClick={handleSubmit} 
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> 전송 중...
                  </>
                ) : (
                  <>제출하기 <Send size={18} /></>
                )}
              </button>
            </div>
          </div>
        );

      case 4: // 완료
        return (
          <div className="text-center space-y-6 py-10 animate-in zoom-in duration-500">
            <div className="flex justify-center">
              <div className="bg-green-100 p-6 rounded-full">
                <CheckCircle2 size={60} className="text-green-500" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">응답이 완료되었습니다!</h2>
            <div className="text-gray-600 space-y-2">
              <p>귀한 의견을 주신 <span className="text-blue-600 font-bold">{formData.name}</span>님 감사드립니다.</p>
              <p className="text-sm">보내주신 의견은 비전트립 기획의<br />소중한 자료로 활용하겠습니다.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition"
            >
              처음으로 돌아가기
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-gray-900">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 overflow-hidden relative">
        {/* 상단 프로그레스 바 */}
        {step > 0 && step < 4 && (
          <div className="absolute top-0 left-0 w-full bg-gray-50 h-1.5">
            <div 
              className="bg-blue-600 h-full transition-all duration-700 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        )}
        
        <div className="p-8 sm:p-10">
          {renderStep()}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
