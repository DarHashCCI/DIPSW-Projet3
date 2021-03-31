<?php

namespace App\EventSubscriber;

use App\Repository\EventZurvanRepository;
use CalendarBundle\CalendarEvents;
use CalendarBundle\Entity\Event;
use CalendarBundle\Event\CalendarEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

class CalendarSubscriber implements EventSubscriberInterface
{
    private $eventRepository;
    private $router;

    public function __construct(
        EventZurvanRepository $eventRepository,
        UrlGeneratorInterface $router
    ) {
        $this->eventRepository = $eventRepository;
        $this->router = $router;
    }

    public static function getSubscribedEvents()
    {
        return [
            CalendarEvents::SET_DATA => 'onCalendarSetData',
        ];
    }

    public function onCalendarSetData(CalendarEvent $calendar)
    {
        $start = $calendar->getStart();
        $end = $calendar->getEnd();
        $filters = $calendar->getFilters();
        $events = $this->eventRepository
            ->findEventsBetweenDates($start, $end, $filters['id']);

        foreach ($events as $event) {
            // this create the events with your data (here booking data) to fill calendar
            $bookingEvent = new Event(
                $event->getTitle(),
                $event->getBeginAt(),
                $event->getEndAt() // If the end date is null or not defined, a all day event is created.
            );

            /*
             * Add custom options to events
             *
             * For more information see: https://fullcalendar.io/docs/event-object
             * and: https://github.com/fullcalendar/fullcalendar/blob/master/src/core/options.ts
             */

            $bookingEvent->setOptions([
                'color' => $event->getBackColor(),
                'textColor' => $event->getTextColor(),
            ]);
            $bookingEvent->addOption(
                'id',
                $event->getId()
                )
            ;

            // finally, add the event to the CalendarEvent to fill the calendar
            $calendar->addEvent($bookingEvent);
        }
    }
}