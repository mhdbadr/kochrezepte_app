import {
    IonButton,
    IonContent,
    IonPage
} from '@ionic/react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const slides = [
    {
        image: "/assets/discover.png",
        title: "Entdecke neue Rezepte",
        description:
            "Finde leckere Gerichte für jeden Geschmack – von schnellen Snacks bis zu besonderen Menüs."
    },
    {
        image: "/assets/create.png",
        title: "Erstelle deine eigenen Rezepte",
        description:
            "Speichere deine Lieblingsrezepte und passe Zutaten und Portionen nach deinen Wünschen an."
    },
    {
        image: "/assets/planner.png",
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
            <IonContent fullscreen>
                <Swiper
                    modules={[Pagination]}
                    pagination={{ clickable: true }}
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <img src={slide.image} alt="" />

                            <h1>{slide.title}</h1>

                            <p>{slide.description}</p>
                            {index === slides.length - 1 && (
                                <IonButton expand="block" onClick={finishOnboarding}>
                                    Los geht&apos;s
                                </IonButton>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </IonContent>
        </IonPage>
    );
}