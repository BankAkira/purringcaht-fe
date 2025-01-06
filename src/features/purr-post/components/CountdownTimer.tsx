// import (Internal imports)
import { useEffect } from 'react';

import styled from 'styled-components';

type Props = {
  title?: string;
  endTime?: string;
};

export default function CountdownTimer({ title, endTime }: Props) {
  useEffect(() => {
    const targetDate = endTime ? new Date(endTime) : new Date();

    const intervalId = setInterval(() => {
      const currentDate = new Date();
      const timeBetweenDates = Math.ceil(
        (targetDate.getTime() - currentDate.getTime()) / 1000
      );

      // Ensure the countdown stops at zero
      if (timeBetweenDates <= 0) {
        clearInterval(intervalId);
        flipAllCards(0);
      } else {
        flipAllCards(timeBetweenDates);
      }
    }, 250);

    return () => clearInterval(intervalId);
  }, [endTime]);

  function flipAllCards(time: number) {
    const seconds = time % 60;
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600) % 24;
    const days = Math.floor(time / (3600 * 24));

    flip(
      document.querySelector('[data-days-tens]') as HTMLElement,
      Math.floor(days / 10)
    );
    flip(document.querySelector('[data-days-ones]') as HTMLElement, days % 10);
    flip(
      document.querySelector('[data-hours-tens]') as HTMLElement,
      Math.floor(hours / 10)
    );
    flip(
      document.querySelector('[data-hours-ones]') as HTMLElement,
      hours % 10
    );
    flip(
      document.querySelector('[data-minutes-tens]') as HTMLElement,
      Math.floor(minutes / 10)
    );
    flip(
      document.querySelector('[data-minutes-ones]') as HTMLElement,
      minutes % 10
    );
    flip(
      document.querySelector('[data-seconds-tens]') as HTMLElement,
      Math.floor(seconds / 10)
    );
    flip(
      document.querySelector('[data-seconds-ones]') as HTMLElement,
      seconds % 10
    );
  }

  function flip(flipCard: HTMLElement, newNumber: number) {
    const topHalf = flipCard.querySelector('.top') as HTMLElement;
    const startNumber = parseInt(topHalf.textContent || '0');
    if (newNumber === startNumber) return;

    const bottomHalf = flipCard.querySelector('.bottom') as HTMLElement;
    const topFlip = document.createElement('div');
    topFlip.classList.add('top-flip');
    const bottomFlip = document.createElement('div');
    bottomFlip.classList.add('bottom-flip');

    topHalf.textContent = startNumber.toString();
    bottomHalf.textContent = startNumber.toString();
    topFlip.textContent = startNumber.toString();
    bottomFlip.textContent = newNumber.toString();

    topFlip.addEventListener('animationstart', () => {
      topHalf.textContent = newNumber.toString();
    });
    topFlip.addEventListener('animationend', () => {
      topFlip.remove();
    });
    bottomFlip.addEventListener('animationend', () => {
      bottomHalf.textContent = newNumber.toString();
      bottomFlip.remove();
    });
    flipCard.append(topFlip, bottomFlip);
  }

  return (
    <CountdownTimerStyle>
      <div className="countdown-timer">
        {title && <div className="title-time">{title}</div>}
        <div className="container">
          <div className="container-segment">
            <div className="segment-title">DAYS</div>
            <div className="segment">
              <div className="flip-card" data-days-tens="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
              <div className="flip-card" data-days-ones="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
            </div>
          </div>
          <div className="container-segment">
            <div className="segment-title">HOURS</div>
            <div className="segment">
              <div className="flip-card" data-hours-tens="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
              <div className="flip-card" data-hours-ones="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
            </div>
          </div>
          <div className="container-segment">
            <div className="segment-title">MINUTES</div>
            <div className="segment">
              <div className="flip-card" data-minutes-tens="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
              <div className="flip-card" data-minutes-ones="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
            </div>
          </div>
          <div className="container-segment">
            <div className="segment-title">SECONDS</div>
            <div className="segment">
              <div className="flip-card" data-seconds-tens="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
              <div className="flip-card" data-seconds-ones="">
                <div className="top">0</div>
                <div className="bottom">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CountdownTimerStyle>
  );
}

const CountdownTimerStyle = styled.div`
  .countdown-timer * {
    box-sizing: border-box;
    font-family: Arial, Helvetica, sans-serif;
  }

  .countdown-timer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title-time {
    color: #fff;
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .container {
    display: flex;
    gap: 0.5em;
    justify-content: center;
  }

  .container-segment {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .segment-title {
    color: #fff;
    font-size: 12px;
    font-weight: 700;
  }

  .segment {
    display: flex;
    gap: 0.1em;
    font-size: 2rem;
    font-weight: 600;
  }

  .flip-card {
    position: relative;
    display: inline-flex;
    flex-direction: column;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.2);
    border-radius: 0.1em;
  }

  .top,
  .bottom,
  .flip-card .top-flip,
  .flip-card .bottom-flip {
    height: 0.75em;
    line-height: 1;
    padding: 0.25em;
    overflow: hidden;
  }

  .top,
  .flip-card .top-flip {
    background-color: #f7f7f7;
    border-top-right-radius: 0.1em;
    border-top-left-radius: 0.1em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }

  .bottom,
  .flip-card .bottom-flip {
    background-color: white;
    display: flex;
    align-items: flex-end;
    border-bottom-right-radius: 0.1em;
    border-bottom-left-radius: 0.1em;
  }

  .flip-card .top-flip {
    position: absolute;
    width: 100%;
    animation: flip-top 250ms ease-in;
    transform-origin: bottom;
  }

  @keyframes flip-top {
    100% {
      transform: rotateX(90deg);
    }
  }

  .flip-card .bottom-flip {
    position: absolute;
    bottom: 0;
    width: 100%;
    animation: flip-bottom 250ms ease-out 250ms;
    transform-origin: top;
    transform: rotateX(90deg);
  }

  @keyframes flip-bottom {
    100% {
      transform: rotateX(0deg);
    }
  }
`;
