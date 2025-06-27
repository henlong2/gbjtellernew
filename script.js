document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card'); // HTML에 존재하는 9개의 카드 버튼들
    const getPredictionBtn = document.getElementById('getPredictionBtn');
    const resetBtn = document.getElementById('resetBtn');
    const predictionResultDiv = document.getElementById('predictionResult');
    const userQuestionInput = document.getElementById('userQuestion');
    const magicButton = document.getElementById('magicButton');
    const cardSelectionArea = document.getElementById('cardSelectionArea');
    let selectedCard = null; // 사용자가 9장의 카드 중 선택한 카드 (실제로는 78장 중 랜덤으로 매핑)

    // 각 타로 카드에 대한 정보 (78장 전체 - 이름, 의미, 상세 설명, 이미지 URL)
    const tarotCards = {
        // Major Arcana (22 Cards)
        'the_fool': { name: '바보 (The Fool)', meaning: '새로운 시작, 모험, 자유로움, 순수함', detail: '당신은 새로운 여정의 시작점에 서 있습니다. 두려워 말고 미지의 길을 탐험하세요. 예상치 못한 기회가 찾아올 수 있습니다.', imageUrl: 'images/the_fool.jpg' },
        'the_magician': { name: '마법사 (The Magician)', meaning: '능력, 창조력, 의지력, 잠재력 발휘', detail: '당신은 원하는 것을 창조할 능력을 가지고 있습니다. 당신의 재능과 도구를 활용하여 아이디어를 현실로 만드세요. 지금이 바로 시작할 때입니다.', imageUrl: 'images/the_magician.jpg' },
        'the_high_priestess': { name: '고위 여사제 (The High Priestess)', meaning: '직관, 비밀, 잠재의식, 지식', detail: '내면의 목소리에 귀 기울이세요. 숨겨진 지혜와 비밀이 드러날 수 있습니다. 직관을 믿고 성급하게 판단하지 마세요.', imageUrl: 'images/the_high_priestess.jpg' },
        'the_empress': { name: '여황제 (The Empress)', meaning: '풍요, 창조성, 모성, 자연과의 교감', detail: '당신 주변에 풍요로움이 가득합니다. 사랑과 아름다움을 표현하고, 창조적인 활동에 집중하세요. 휴식과 치유의 시간이 필요할 수도 있습니다.', imageUrl: 'images/the_empress.jpg' },
        'the_emperor': { name: '황제 (The Emperor)', meaning: '권위, 통제, 안정, 아버지상', detail: '질서와 구조를 확립할 때입니다. 책임감을 가지고 상황을 통제하며 리더십을 발휘하세요. 현실적인 계획과 실행이 중요합니다.', imageUrl: 'images/the_emperor.jpg' },
        'the_hierophant': { name: '교황 (The Hierophant)', meaning: '전통, 가르침, 영적 인도, 신념', detail: '전통적인 가치와 신념을 따르거나, 멘토로부터 지혜를 구할 시기입니다. 당신의 도덕적 원칙을 지키고, 배우고 가르치는 데 집중하세요.', imageUrl: 'images/the_hierophant.jpg' },
        'the_lovers': { name: '연인 (The Lovers)', meaning: '선택, 관계, 조화, 사랑', detail: '중요한 선택의 기로에 서 있습니다. 인간관계에서의 조화와 소통이 중요하며, 사랑과 이해가 깊어질 수 있습니다. 마음이 이끄는 대로 선택하세요.', imageUrl: 'images/the_lovers.jpg' },
        'the_chariot': { name: '전차 (The Chariot)', meaning: '승리, 결단력, 의지력, 통제', detail: '확고한 결단력과 의지로 목표를 향해 나아가세요. 장애물을 극복하고 성공을 거둘 수 있습니다. 당신의 노력이 결실을 맺을 것입니다.', imageUrl: 'images/the_chariot.jpg' },
        'strength': { name: '힘 (Strength)', meaning: '용기, 인내, 내면의 강인함, 부드러운 통제', detail: '당신 안의 강한 힘과 용기를 발휘할 때입니다. 겉으로 드러나는 힘보다 내면의 강인함과 인내심으로 어려움을 극복하세요.', imageUrl: 'images/strength.jpg' },
        'the_hermit': { name: '은둔자 (The Hermit)', meaning: '성찰, 고독, 내면의 탐구, 지혜', detail: '잠시 멈추고 내면을 들여다볼 시간이 필요합니다. 혼자만의 시간을 가지며 자신을 성찰하고 진정한 지혜를 찾아보세요.', imageUrl: 'images/the_hermit.jpg' },
        'wheel_of_fortune': { name: '운명의 수레바퀴 (Wheel of Fortune)', meaning: '변화, 운명, 전환점, 기회', detail: '인생의 새로운 국면이 시작될 수 있습니다. 긍정적인 변화를 받아들이고, 찾아오는 기회를 놓치지 마세요. 행운이 따를 것입니다.', imageUrl: 'images/wheel_of_fortune.jpg' },
        'justice': { name: '정의 (Justice)', meaning: '공정함, 균형, 진실, 책임', detail: '공정하고 정의로운 판단이 필요한 시기입니다. 모든 상황을 객관적으로 보고 균형을 맞추려고 노력하세요. 당신의 행동에 책임이 따릅니다.', imageUrl: 'images/justice.jpg' },
        'the_hanged_man': { name: '매달린 남자 (The Hanged Man)', meaning: '희생, 새로운 관점, 정지, 통찰', detail: '상황을 다른 관점에서 바라볼 필요가 있습니다. 잠시 멈추고 희생을 감수함으로써 새로운 깨달음을 얻을 수 있습니다. 인내심을 가지세요.', imageUrl: 'images/the_hanged_man.jpg' },
        'death': { name: '죽음 (Death)', meaning: '변화, 종결, 재생, 새로운 시작', detail: '두려워 말고 다가오는 변화를 받아들이세요. 낡은 것은 끝나고 새로운 것이 시작될 것입니다. 이는 긍정적인 변화를 위한 필수 과정입니다.', imageUrl: 'images/death.jpg' },
        'temperance': { name: '절제 (Temperance)', meaning: '균형, 조화, 인내, 중용', detail: '모든 면에서 균형과 조화를 추구하세요. 극단적인 행동을 피하고 인내심을 가지면 좋은 결과를 얻을 수 있습니다. 평화를 찾을 때입니다.', imageUrl: 'images/temperance.jpg' },
        'the_devil': { name: '악마 (The Devil)', meaning: '속박, 유혹, 물질주의, 그림자 자아', detail: '당신을 묶어두는 것에서 벗어나세요. 유혹에 빠지지 않도록 경계하고, 자신의 어두운 면을 직시하여 진정한 자유를 찾으세요.', imageUrl: 'images/the_devil.jpg' },
        'the_tower': { name: '탑 (The Tower)', meaning: '파괴, 갑작스러운 변화, 계시, 해방', detail: '기존의 틀이 무너지고 있습니다. 이는 고통스러울 수 있지만, 결국 더 나은 방향으로 나아가기 위한 불가피한 변화입니다. 진실을 직시하세요.', imageUrl: 'images/the_tower.jpg' },
        'the_star': { name: '별 (The Star)', meaning: '희망, 영감, 치유, 평온', detail: '밝은 미래가 당신을 기다립니다. 긍정적인 마음으로 나아가세요. 당신의 꿈이 이루어질 가능성이 높으며, 치유와 평온을 찾을 수 있습니다.', imageUrl: 'images/the_star.jpg' },
        'the_moon': { name: '달 (The Moon)', meaning: '환상, 직관, 잠재의식, 불확실성', detail: '불확실함과 환상이 공존하는 시기입니다. 당신의 직관을 믿고, 내면의 목소리에 귀 기울이세요. 숨겨진 진실을 발견할 수 있습니다.', imageUrl: 'images/the_moon.jpg' },
        'the_sun': { name: '태양 (The Sun)', meaning: '성공, 행복, 활력, 명료함', detail: '가장 긍정적인 카드 중 하나입니다. 성공과 행복이 따를 것이며, 활력이 넘치는 하루 또는 시기가 될 것입니다. 모든 것이 명확해집니다.', imageUrl: 'images/the_sun.jpg' },
        'judgement': { name: '심판 (Judgement)', meaning: '갱생, 재평가, 부활, 내면의 부름', detail: '과거를 돌아보고 자신을 재평가할 시기입니다. 중요한 결정이 내려지거나, 새로운 삶의 단계로 진입할 수 있습니다. 내면의 부름에 응답하세요.', imageUrl: 'images/judgement.jpg' },
        'the_world': { name: '세계 (The World)', meaning: '완성, 성취, 통합, 완벽', detail: '오랜 노력이 결실을 맺고 목표를 달성할 시기입니다. 만족스럽고 완벽한 결과를 얻을 수 있습니다. 새로운 주기의 시작을 준비하세요.', imageUrl: 'images/the_world.jpg' },

        // Minor Arcana - Suit of Cups (14 Cards)
        'ace_of_cups': { name: '컵 에이스 (Ace of Cups)', meaning: '새로운 감정, 사랑의 시작, 영적 충만', detail: '새로운 감정적인 시작, 사랑의 기회, 또는 영적인 깨달음이 찾아옵니다. 마음을 열고 새로운 경험을 받아들이세요.', imageUrl: 'images/ace_of_cups.jpg' },
        'two_of_cups': { name: '컵 2 (Two of Cups)', meaning: '파트너십, 상호 존중, 유대감 형성', detail: '깊은 유대감과 상호 존중을 기반으로 한 관계가 형성됩니다. 연인, 친구 또는 사업 파트너와의 조화로운 연결을 나타냅니다.', imageUrl: 'images/two_of_cups.jpg' },
        'three_of_cups': { name: '컵 3 (Three of Cups)', meaning: '축하, 공동체, 즐거움, 우정', detail: '기쁨과 축하의 시간입니다. 친구나 공동체와 함께 성공을 나누고 즐거움을 만끽하세요. 좋은 소식이 있을 수 있습니다.', imageUrl: 'images/three_of_cups.jpg' },
        'four_of_cups': { name: '컵 4 (Four of Cups)', meaning: '권태, 불만족, 새로운 기회 거부', detail: '현실에 만족하지 못하고 새로운 기회를 외면하고 있을 수 있습니다. 주변을 둘러보고 새로운 관점을 받아들일 필요가 있습니다.', imageUrl: 'images/four_of_cups.jpg' },
        'five_of_cups': { name: '컵 5 (Five of Cups)', meaning: '상실, 후회, 슬픔, 남아있는 것 보기', detail: '상실감과 후회에 빠져 있을 수 있습니다. 과거의 아픔에만 집중하기보다 남아있는 긍정적인 면을 보고 앞으로 나아가세요.', imageUrl: 'images/five_of_cups.jpg' },
        'six_of_cups': { name: '컵 6 (Six of Cups)', meaning: '향수, 과거, 순수함, 어린 시절', detail: '과거의 추억이나 어린 시절의 순수함으로 돌아가고 싶은 마음을 나타냅니다. 과거로부터 위로를 받거나, 오래된 친구를 만날 수 있습니다.', imageUrl: 'images/six_of_cups.jpg' },
        'seven_of_cups': { name: '컵 7 (Seven of Cups)', meaning: '환상, 선택의 혼란, 많은 기회', detail: '너무 많은 선택지나 환상으로 인해 혼란스러울 수 있습니다. 현실적인 목표를 설정하고, 진정으로 중요한 것이 무엇인지 파악해야 합니다.', imageUrl: 'images/seven_of_cups.jpg' },
        'eight_of_cups': { name: '컵 8 (Eight of Cups)', meaning: '떠남, 포기, 새로운 탐구, 불만족', detail: '현재의 상황에 만족하지 못하고 새로운 것을 찾아 떠날 때입니다. 물질적인 것을 뒤로하고 정신적인 만족을 추구하게 될 것입니다.', imageUrl: 'images/eight_of_cups.jpg' },
        'nine_of_cups': { name: '컵 9 (Nine of Cups)', meaning: '소원 성취, 만족, 행복, 즐거움', detail: '당신의 소원이 이루어지고 만족감을 느낄 수 있는 시기입니다. 노력의 결실을 맺고 행복을 만끽하세요. 자신에게 상을 줄 때입니다.', imageUrl: 'images/nine_of_cups.jpg' },
        'ten_of_cups': { name: '컵 10 (Ten of Cups)', meaning: '완전한 행복, 가족, 조화, 영원한 사랑', detail: '완전한 행복과 만족을 느끼는 시기입니다. 가족과의 화목, 안정된 관계, 꿈꿔왔던 유토피아적인 삶을 의미합니다.', imageUrl: 'images/ten_of_cups.jpg' },
        'page_of_cups': { name: '컵 시종 (Page of Cups)', meaning: '감성적인 메시지, 새로운 아이디어, 직관의 시작', detail: '감성적이거나 창의적인 새로운 소식이 찾아옵니다. 당신의 직관을 따르고, 새로운 예술적 영감을 받아들이세요.', imageUrl: 'images/page_of_cups.jpg' },
        'knight_of_cups': { name: '컵 기사 (Knight of Cups)', meaning: '낭만적인 제안, 감성적인 접근, 예술적 추구', detail: '낭만적인 제안이나 감성적인 접근이 있을 수 있습니다. 당신의 감정을 솔직하게 표현하고, 예술적인 열정을 좇으세요.', imageUrl: 'images/knight_of_cups.jpg' },
        'queen_of_cups': { name: '컵 여왕 (Queen of Cups)', meaning: '감성적 지혜, 공감, 직관적 이해, 자비로움', detail: '당신의 감성적인 지혜와 공감 능력이 빛을 발할 때입니다. 다른 사람에게 위로와 이해를 제공하며, 당신의 직관을 믿으세요.', imageUrl: 'images/queen_of_cups.jpg' },
        'king_of_cups': { name: '컵 왕 (King of Cups)', meaning: '감정적 통제, 균형, 관대함, 외교적 능력', detail: '당신은 감정을 통제하고 균형을 유지하는 데 능숙합니다. 관대하고 외교적인 태도로 주변 사람들에게 긍정적인 영향을 미치세요.', imageUrl: 'images/king_of_cups.jpg' },

        // Minor Arcana - Suit of Pentacles (14 Cards)
        'ace_of_pentacles': { name: '펜타클 에이스 (Ace of Pentacles)', meaning: '새로운 기회, 물질적 시작, 안정, 번영', detail: '새로운 물질적 기회나 안정적인 시작을 의미합니다. 재정적인 성장이나 새로운 프로젝트의 시작이 있을 수 있습니다. 현실적인 계획을 세우세요.', imageUrl: 'images/ace_of_pentacles.jpg' },
        'two_of_pentacles': { name: '펜타클 2 (Two of Pentacles)', meaning: '균형 맞추기, 유연성, 여러 일 저글링', detail: '여러 가지 일 사이에서 균형을 맞추려고 노력하고 있습니다. 유연한 사고로 상황에 대처하면 모든 것을 잘 처리할 수 있습니다.', imageUrl: 'images/two_of_pentacles.jpg' },
        'three_of_pentacles': { name: '펜타클 3 (Three of Pentacles)', meaning: '협력, 팀워크, 기술 향상, 인정', detail: '다른 사람들과의 협력을 통해 목표를 달성할 시기입니다. 당신의 기술이 향상되고 노력에 대한 인정을 받을 수 있습니다.', imageUrl: 'images/three_of_pentacles.jpg' },
        'four_of_pentacles': { name: '펜타클 4 (Four of Pentacles)', meaning: '소유, 안정, 통제, 물질에 대한 집착', detail: '물질적인 안정과 소유를 중요하게 여기는 시기입니다. 때로는 지나친 집착이 될 수 있으니, 베푸는 마음도 가지세요.', imageUrl: 'images/four_of_pentacles.jpg' },
        'five_of_pentacles': { name: '펜타클 5 (Five of Pentacles)', meaning: '결핍, 어려움, 고립, 도움 요청의 필요성', detail: '어려움과 결핍을 겪고 있을 수 있습니다. 혼자 고립되지 말고, 주변에 도움을 청하면 해결책을 찾을 수 있습니다.', imageUrl: 'images/five_of_pentacles.jpg' },
        'six_of_pentacles': { name: '펜타클 6 (Six of Pentacles)', meaning: '나눔, 자선, 공정함, 주고받기', detail: '당신이 베풀거나 도움을 받는 시기입니다. 공정한 나눔과 균형 잡힌 관계를 통해 물질적, 정신적 풍요를 경험할 수 있습니다.', imageUrl: 'images/six_of_pentacles.jpg' },
        'seven_of_pentacles': { name: '펜타클 7 (Seven of Pentacles)', meaning: '인내심, 투자, 노력의 평가, 장기적인 관점', detail: '당신의 노력과 투자가 결실을 맺는 데 시간이 필요합니다. 인내심을 가지고 장기적인 관점에서 상황을 평가하세요.', imageUrl: 'images/seven_of_pentacles.jpg' },
        'eight_of_pentacles': { name: '펜타클 8 (Eight of Pentacles)', meaning: '기술 숙련, 헌신, 노력, 장인 정신', detail: '기술을 연마하고 숙련도를 높이는 데 집중할 때입니다. 헌신적인 노력과 장인 정신으로 탁월한 결과를 만들어낼 수 있습니다.', imageUrl: 'images/eight_of_pentacles.jpg' },
        'nine_of_pentacles': { name: '펜타클 9 (Nine of Pentacles)', meaning: '자립, 자족, 풍요, 자기 만족', detail: '당신의 노력으로 얻은 풍요와 안정감을 만끽할 때입니다. 타인의 도움 없이도 스스로 만족하며 삶을 즐기세요.', imageUrl: 'images/nine_of_pentacles.jpg' },
        'ten_of_pentacles': { name: '펜타클 10 (Ten of Pentacles)', meaning: '안정된 기반, 가족 유산, 완전한 풍요', detail: '가족과의 유대, 물질적인 풍요, 안정된 기반을 의미합니다. 당신의 노력으로 대대로 이어질 수 있는 유산을 만들 수 있습니다.', imageUrl: 'images/ten_of_pentacles.jpg' },
        'page_of_pentacles': { name: '펜타클 시종 (Page of Pentacles)', meaning: '새로운 학습, 물질적 기회, 현실적인 접근', detail: '새로운 학습 기회나 현실적인 제안이 찾아옵니다. 실용적인 접근 방식으로 새로운 기술을 배우거나 재정적인 기회를 탐색하세요.', imageUrl: 'images/page_of_pentacles.jpg' },
        'knight_of_pentacles': { name: '펜타클 기사 (Knight of Pentacles)', meaning: '성실함, 책임감, 꾸준함, 실용적인 행동', detail: '성실하고 책임감 있는 자세로 꾸준히 목표를 향해 나아가세요. 실용적인 행동과 인내심이 성공의 열쇠가 될 것입니다.', imageUrl: 'images/knight_of_pentacles.jpg' },
        'queen_of_pentacles': { name: '펜타클 여왕 (Queen of Pentacles)', meaning: '실용적인 돌봄, 모성애, 풍요, 안정', detail: '실용적이고 nurturing한 에너지를 발휘할 때입니다. 주변 사람들에게 안정과 풍요를 제공하며, 당신의 재능으로 현실적인 도움을 줄 수 있습니다.', imageUrl: 'images/queen_of_pentacles.jpg' },
        'king_of_pentacles': { name: '펜타클 왕 (King of Pentacles)', meaning: '성공적인 사업가, 안정된 지도자, 물질적 풍요', detail: '사업적 성공과 물질적인 풍요를 나타냅니다. 안정적인 리더십과 실용적인 지혜로 당신의 영역을 성공적으로 이끌 수 있습니다.', imageUrl: 'images/king_of_pentacles.jpg' },

        // Minor Arcana - Suit of Swords (14 Cards)
        'ace_of_swords': { name: '검 에이스 (Ace of Swords)', meaning: '새로운 아이디어, 명확성, 돌파구, 진실', detail: '새로운 아이디어나 명확한 통찰력이 찾아옵니다. 혼란을 뚫고 진실을 발견할 때이며, 논리적인 사고로 문제를 해결하세요.', imageUrl: 'images/ace_of_swords.jpg' },
        'two_of_swords': { name: '검 2 (Two of Swords)', meaning: '선택의 어려움, 교착 상태, 회피', detail: '중요한 결정 앞에서 망설이고 있을 수 있습니다. 감정을 배제하고 논리적으로 상황을 분석하여 균형 잡힌 선택을 해야 합니다.', imageUrl: 'images/two_of_swords.jpg' },
        'three_of_swords': { name: '검 3 (Three of Swords)', meaning: '상처, 슬픔, 배신, 고통', detail: '마음의 상처나 슬픔을 겪을 수 있습니다. 고통스럽더라도 현실을 직시하고, 상처를 치유하기 위한 시간을 가지세요.', imageUrl: 'images/three_of_swords.jpg' },
        'four_of_swords': { name: '검 4 (Four of Swords)', meaning: '휴식, 회복, 명상, 잠시 멈춤', detail: '지친 심신을 회복하기 위한 휴식이 필요합니다. 잠시 일을 멈추고 명상을 통해 에너지를 재충전하고 다음 단계를 준비하세요.', imageUrl: 'images/four_of_swords.jpg' },
        'five_of_swords': { name: '검 5 (Five of Swords)', meaning: '갈등, 패배, 비열한 승리, 불화', detail: '갈등이나 논쟁에 휘말릴 수 있으며, 패배감을 느낄 수도 있습니다. 승리하더라도 주변과의 관계가 악화될 수 있으니 신중해야 합니다.', imageUrl: 'images/five_of_swords.jpg' },
        'six_of_swords': { name: '검 6 (Six of Swords)', meaning: '이동, 어려움으로부터 벗어남, 전환', detail: '힘든 상황이나 혼란스러운 시기를 벗어나 평온한 곳으로 이동하고 있습니다. 과거를 뒤로하고 새로운 미래를 향해 나아가세요.', imageUrl: 'images/six_of_swords.jpg' },
        'seven_of_swords': { name: '검 7 (Seven of Swords)', meaning: '기만, 속임수, 도피, 전략', detail: '정직하지 못한 행동이나 속임수에 연루될 수 있습니다. 상황을 회피하거나 몰래 행동하려는 경향이 있으니 주의하세요.', imageUrl: 'images/seven_of_swords.jpg' },
        'eight_of_swords': { name: '검 8 (Eight of Swords)', meaning: '속박, 제한, 무력감, 자기 비판', detail: '자신이 갇혀 있다고 느끼며 무력감에 빠져 있을 수 있습니다. 이는 주로 스스로 만든 제약일 수 있으니, 관점을 바꿔보세요.', imageUrl: 'images/eight_of_swords.jpg' },
        'nine_of_swords': { name: '검 9 (Nine of Swords)', meaning: '악몽, 걱정, 불안, 죄책감', detail: '극심한 걱정, 불안, 죄책감에 시달리고 있을 수 있습니다. 대부분의 걱정은 현실보다 상상 속에서 커지는 것이니, 마음을 진정시키세요.', imageUrl: 'images/nine_of_swords.jpg' },
        'ten_of_swords': { name: '검 10 (Ten of Swords)', meaning: '완전한 끝, 최악의 상황, 재생의 시작', detail: '최악의 상황에 도달하여 모든 것이 끝났다고 느낄 수 있습니다. 하지만 이는 새로운 시작을 위한 필수적인 종결이니, 희망을 잃지 마세요.', imageUrl: 'images/ten_of_swords.jpg' },
        'page_of_swords': { name: '검 시종 (Page of Swords)', meaning: '새로운 정보, 호기심, 명확한 사고의 시작', detail: '새로운 정보나 명확한 아이디어가 찾아옵니다. 호기심을 가지고 새로운 지식을 탐구하며, 당신의 생각을 솔직하게 표현하세요.', imageUrl: 'images/page_of_swords.jpg' },
        'knight_of_swords': { name: '검 기사 (Knight of Swords)', meaning: '빠른 행동, 돌격, 진취적, 무모함', detail: '빠르고 단호한 행동이 필요한 시기입니다. 목표를 향해 거침없이 나아가지만, 때로는 무모하거나 성급할 수 있으니 주의하세요.', imageUrl: 'images/knight_of_swords.jpg' },
        'queen_of_swords': { name: '검 여왕 (Queen of Swords)', meaning: '명확한 사고, 독립성, 진실 추구, 솔직함', detail: '명확하고 독립적인 사고로 상황을 판단할 때입니다. 감정에 휘둘리지 않고 진실을 추구하며, 솔직하고 단호하게 행동하세요.', imageUrl: 'images/queen_of_swords.jpg' },
        'king_of_swords': { name: '검 왕 (King of Swords)', meaning: '논리적 권위, 지성, 공정한 판단, 분석력', detail: '논리적이고 지적인 권위를 가진 인물이 됩니다. 공정하고 객관적인 판단력으로 복잡한 문제를 해결하고 리더십을 발휘할 수 있습니다.', imageUrl: 'images/king_of_swords.jpg' },

        // Minor Arcana - Suit of Wands (14 Cards)
        'ace_of_wands': { name: '완드 에이스 (Ace of Wands)', meaning: '새로운 열정, 영감, 시작, 창의력', detail: '새로운 열정이나 영감이 당신을 이끌어갈 것입니다. 창의적인 프로젝트나 모험적인 시작을 위한 좋은 시기입니다.', imageUrl: 'images/ace_of_wands.jpg' },
        'two_of_wands': { name: '완드 2 (Two of Wands)', meaning: '계획, 미래 구상, 결단, 잠재력', detail: '미래를 계획하고 큰 그림을 그릴 때입니다. 현재의 위치에서 더 큰 목표를 향해 나아갈 결단력이 필요합니다.', imageUrl: 'images/two_of_wands.jpg' },
        'three_of_wands': { name: '완드 3 (Three of Wands)', meaning: '확장, 성장, 파트너십, 해외 진출', detail: '당신의 계획이 확장되고 성장할 것입니다. 새로운 파트너십을 통해 더 큰 목표를 달성하거나 해외와 관련된 기회가 생길 수 있습니다.', imageUrl: 'images/three_of_wands.jpg' },
        'four_of_wands': { name: '완드 4 (Four of Wands)', meaning: '축하, 안정, 가정, 공동체', detail: '성공적인 이정표를 기념하고 축하할 때입니다. 가정의 안정과 공동체에서의 소속감을 느끼며 기쁨을 나눌 수 있습니다.', imageUrl: 'images/four_of_wands.jpg' },
        'five_of_wands': { name: '완드 5 (Five of Wands)', meaning: '경쟁, 갈등, 도전, 혼돈', detail: '경쟁이나 갈등 상황에 놓일 수 있습니다. 이는 성장하기 위한 도전일 수 있으니, 자신을 표현하고 목소리를 내세요.', imageUrl: 'images/five_of_wands.jpg' },
        'six_of_wands': { name: '완드 6 (Six of Wands)', meaning: '승리, 성공, 대중적 인정, 자신감', detail: '노력의 결실을 맺고 성공을 거두며 대중적인 인정을 받을 때입니다. 자신감을 가지고 앞으로 나아가세요.', imageUrl: 'images/six_of_wands.jpg' },
        'seven_of_wands': { name: '완드 7 (Seven of Wands)', meaning: '방어, 도전, 용기, 끈기', detail: '도전적인 상황에 직면하여 자신을 방어해야 할 수 있습니다. 용기를 가지고 끈기 있게 맞서 싸우면 극복할 수 있습니다.', imageUrl: 'images/seven_of_wands.jpg' },
        'eight_of_wands': { name: '완드 8 (Eight of Wands)', meaning: '빠른 진행, 소식, 움직임, 즉각적인 행동', detail: '모든 일이 빠르게 진행될 것입니다. 예상치 못한 소식이나 기회가 찾아오며, 즉각적인 행동이 필요할 수 있습니다.', imageUrl: 'images/eight_of_wands.jpg' },
        'nine_of_wands': { name: '완드 9 (Nine of Wands)', meaning: '인내심, 회복력, 마지막 도전, 경계', detail: '많은 어려움을 겪었지만, 여전히 강한 의지로 버티고 있습니다. 마지막 도전에 직면하여 인내심과 경계심을 유지해야 합니다.', imageUrl: 'images/nine_of_wands.jpg' },
        'ten_of_wands': { name: '완드 10 (Ten of Wands)', meaning: '부담, 책임, 과로, 짐', detail: '지나치게 많은 책임이나 부담을 안고 있을 수 있습니다. 짐을 내려놓고 휴식을 취하거나, 도움을 요청할 필요가 있습니다.', imageUrl: 'images/ten_of_wands.jpg' },
        'page_of_wands': { name: '완드 시종 (Page of Wands)', meaning: '새로운 모험, 영감의 시작, 열정적인 소식', detail: '새로운 모험이나 영감을 주는 소식이 찾아옵니다. 호기심을 가지고 새로운 기회를 탐색하며, 당신의 열정을 표현하세요.', imageUrl: 'images/page_of_wands.jpg' },
        'knight_of_wands': { name: '완드 기사 (Knight of Wands)', meaning: '열정적인 행동, 모험, 에너지, 성급함', detail: '열정적으로 목표를 향해 돌진할 때입니다. 에너지 넘치고 모험적인 행동이 당신을 이끌지만, 때로는 성급할 수 있으니 주의하세요.', imageUrl: 'images/knight_of_wands.jpg' },
        'queen_of_wands': { name: '완드 여왕 (Queen of Wands)', meaning: '자신감, 매력, 활력, 독립성', detail: '당신의 자신감과 매력이 빛을 발할 때입니다. 활기찬 에너지로 주변 사람들에게 영감을 주며, 독립적인 태도로 목표를 추구하세요.', imageUrl: 'images/queen_of_wands.jpg' },
        'king_of_wands': { name: '완드 왕 (King of Wands)', meaning: '비전, 리더십, 기업가 정신, 영감', detail: '비전과 리더십을 가지고 큰 그림을 그릴 때입니다. 당신의 영감과 기업가 정신으로 새로운 프로젝트를 성공적으로 이끌 수 있습니다.', imageUrl: 'images/king_of_wands.jpg' }
    };

    // 초기 상태 설정
    magicButton.style.display = 'none'; // MAGIC 버튼 초기에는 숨김
    cardSelectionArea.style.display = 'none'; // 카드 선택 영역 초기에는 숨김
    getPredictionBtn.disabled = true; // '마음의 버튼' 초기 비활성화
    userQuestionInput.focus(); // 페이지 로드 시 질문 입력창에 포커스

    // 질문 입력 시 MAGIC 버튼 활성화/비활성화
    userQuestionInput.addEventListener('input', () => {
        const questionText = userQuestionInput.value.trim();
        if (questionText.length > 0) {
            magicButton.style.display = 'block'; // 질문이 있으면 MAGIC 버튼 보이게
        } else {
            magicButton.style.display = 'none'; // 질문이 없으면 MAGIC 버튼 숨김
            cardSelectionArea.style.display = 'none'; // 질문이 지워지면 카드 선택 영역도 숨김
            getPredictionBtn.disabled = true; // '마음의 버튼' 비활성화
            predictionResultDiv.innerHTML = ''; // 결과도 지움
            resetCardSelection(); // 카드 선택 초기화 (선택된 카드, 활성화 상태)
        }
    });

    // MAGIC 버튼 클릭 시 카드 선택 영역 표시 및 카드 활성화
    magicButton.addEventListener('click', () => {
        const userQuestion = userQuestionInput.value.trim();
        if (userQuestion.length === 0) {
            alert('먼저 질문을 입력해주세요!');
            return;
        }

        cardSelectionArea.style.display = 'grid'; // 카드 선택 영역 보이게
        magicButton.disabled = true; // MAGIC 버튼 비활성화
        userQuestionInput.readOnly = true; // 질문 입력창 읽기 전용으로 변경
        
        cards.forEach(card => {
            card.disabled = false; // 9개의 카드 버튼 활성화
        });
    });

    // 9개의 카드 중 하나를 선택할 때 (실제로는 78장 중 랜덤으로 선택됨)
    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!card.disabled) {
                // 이전에 선택된 카드 클래스 제거
                cards.forEach(c => c.classList.remove('selected'));
                // 현재 클릭된 카드에 selected 클래스 추가
                card.classList.add('selected');

                // 78장의 카드 중에서 무작위로 하나의 카드 선택
                const cardKeys = Object.keys(tarotCards);
                const randomIndex = Math.floor(Math.random() * cardKeys.length);
                selectedCard = cardKeys[randomIndex]; // 무작위로 선택된 78장 중 카드 ID 저장

                getPredictionBtn.disabled = false; // '마음의 버튼' 활성화
            }
        });
    });

    // '마음의 버튼' 클릭 시 예측 결과 표시
    getPredictionBtn.addEventListener('click', () => {
        if (!selectedCard) { // 9개의 카드 중 하나를 선택하지 않았으면
            alert('예언을 보기 위해 9개의 카드 중 하나를 선택해주세요!');
            return;
        }

        displayPrediction(); // 예측 결과 표시
        getPredictionBtn.disabled = true; // '마음의 버튼' 비활성화
        cards.forEach(card => card.disabled = true); // 9개의 카드 모두 비활성화 (더 이상 선택 불가)
    });

    // '새로운 시작' 버튼 클릭 시 게임 초기화
    resetBtn.addEventListener('click', () => {
        resetGame();
    });

    // 예측 결과를 화면에 표시하는 함수
    function displayPrediction() {
        const userQuestion = userQuestionInput.value.trim();
        let predictionHtml = '<h2>당신의 예언 결과:</h2>';

        if (userQuestion) {
            predictionHtml += `<p><strong>질문:</strong> ${userQuestion}</p><hr>`;
        } else {
            predictionHtml += `<p><strong>(질문 없이 카드를 뽑으셨습니다.)</strong></p><hr>`;
        }

        const cardData = tarotCards[selectedCard]; // 무작위로 선택된 78장 중 카드 사용
        if (cardData) {
            predictionHtml += `
                <div class="card-prediction">
                    <img src="${cardData.imageUrl}" alt="${cardData.name}" class="tarot-card-image">
                    <h3>${cardData.name}</h3>
                    <p><strong>예언:</strong></p>
                    <p>${cardData.detail}</p>
                </div>
                <hr>
            `;
        }
        predictionResultDiv.innerHTML = predictionHtml;
        predictionResultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // 9개의 카드 선택 상태를 초기화하는 함수
    function resetCardSelection() {
        cards.forEach(card => {
            card.classList.remove('selected');
            card.disabled = true; // 모든 카드를 다시 비활성화
        });
        selectedCard = null; // 선택된 카드 초기화
    }

    // 게임 전체를 초기화하는 함수
    function resetGame() {
        resetCardSelection(); // 카드 선택 관련 초기화
        predictionResultDiv.innerHTML = ''; // 예측 결과 지우기
        userQuestionInput.value = ''; // 질문 입력창 내용 지우기
        userQuestionInput.readOnly = false; // 질문 입력창 다시 활성화
        magicButton.style.display = 'none'; // MAGIC 버튼 숨김
        magicButton.disabled = false; // MAGIC 버튼 다시 활성화
        cardSelectionArea.style.display = 'none'; // 카드 선택 영역 숨김
        getPredictionBtn.disabled = true; // '마음의 버튼' 비활성화
        userQuestionInput.focus(); // 질문 입력창에 포커스
    }
});