import {
    IonButton,
    IonContent,
    IonPage
} from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import './OnboardingPage.css';
import boardingVideo from '../assets/boarding.mp4';
import boarding2 from '../assets/board2.png';
import boarding3 from '../assets/board3.png';
import discoverImage from '../assets/1bild.png';

const slides = [
    {
        video: boardingVideo,
        title: "Entdecke neue Rezepte",
        description:
            "Finde leckere Gerichte für jeden Geschmack – von schnellen Snacks bis zu besonderen Menüs."
    },
    {
        image: boarding2,
        title: "Erstelle deine eigenen Rezepte",
        description:
            "Speichere deine Lieblingsrezepte und passe Zutaten und Portionen nach deinen Wünschen an."
    },
    {
        image: boarding3,
        title: "Plane deine Woche",
        description:
            "Organisiere deine Mahlzeiten und behalte den Überblick über deine Rezepte für die ganze Woche."
    }
];

export default function OnboardingPage() {

    const finishOnboarding = () => {
        localStorage.setItem('onboardingCompleted', 'true');
        window.location.href = '/login';
    };

    return (
        <IonPage>
            <IonContent fullscreen className="onboarding-content">
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                    className="onboarding-swiper"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="onboarding-slide">

                                <div className="media-box">
                                    {slide.video ? (
                                        <video
                                            className="onboarding-video"
                                            src={slide.video}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            className="onboarding-image"
                                            src={slide.image}
                                            alt="image"
                                        />
                                    )}
                                </div>

                                <h1>{slide.title}</h1>

                                <p>{slide.description}</p>

                                {index === slides.length - 1 && (
                                    <IonButton
                                        expand="block"
                                        className="start-button"
                                        onClick={finishOnboarding}
                                    >
                                        Los geht&apos;s
                                    </IonButton>
                                )}

                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </IonContent>
        </IonPage>
    );
}