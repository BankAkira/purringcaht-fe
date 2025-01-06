export const confirmBgColor = (
  isConfirmed?: boolean,
  isWinner?: boolean,
  type?: 'agree' | 'disagree',
  isLuckyDraw?: boolean,
  statusLuckyDraw?: string
) => {
  if (type === 'agree') {
    if (isLuckyDraw) {
      if (isConfirmed) {
        if (statusLuckyDraw !== 'REJECTED') {
          return 'bg-[#31C48D]';
        } else {
          return 'bg-[#D1D5DB]';
        }
      } else {
        return 'bg-[#31C48D]';
      }
    } else {
      if (isConfirmed) {
        if (isWinner) {
          return 'bg-[#31C48D]';
        } else {
          return 'bg-[#D1D5DB]';
        }
      } else {
        return 'bg-[#31C48D]';
      }
    }
  } else {
    if (isLuckyDraw) {
      if (isConfirmed) {
        if (statusLuckyDraw === 'REJECTED') {
          return 'bg-[#F05252]';
        } else {
          return 'bg-[#D1D5DB]';
        }
      } else {
        return 'bg-[#F05252]';
      }
    } else {
      if (isConfirmed) {
        if (isWinner) {
          return 'bg-[#D1D5DB]';
        } else {
          return 'bg-[#F05252]';
        }
      } else {
        return 'bg-[#F05252]';
      }
    }
  }
};
