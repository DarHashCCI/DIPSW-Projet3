<?php

namespace App\Entity;

use App\Repository\EventZurvanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=EventZurvanRepository::class)
 */
class EventZurvan
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $beginAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $endAt = null;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $description;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $backColor="#FF0000";

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $textColor="white";

    /**
     * @ORM\ManyToMany(targetEntity=User::class, mappedBy="events")
     */
    private $invites;

    public function __construct()
    {
        $this->invites = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBeginAt(): ?\DateTimeInterface
    {
        return $this->beginAt;
    }

    public function setBeginAt(\DateTimeInterface $beginAt): self
    {
        $this->beginAt = $beginAt;

        return $this;
    }

    public function getEndAt(): ?\DateTimeInterface
    {
        return $this->endAt;
    }

    public function setEndAt(?\DateTimeInterface $endAt): self
    {
        $this->endAt = $endAt;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getBackColor(): ?string
    {
        return $this->backColor;
    }

    public function setBackColor(string $backColor): self
    {
        $this->backColor = $backColor;

        return $this;
    }

    public function getTextColor(): ?string
    {
        return $this->textColor;
    }

    public function setTextColor(string $textColor): self
    {
        $this->textColor = $textColor;

        return $this;
    }

    /**
     * @return Collection|User[]
     */
    public function getInvites(): Collection
    {
        return $this->invites;
    }

    public function addInvite(User $invite): self
    {
        if (!$this->invites->contains($invite)) {
            $this->invites[] = $invite;
            $invite->addEvent($this);
        }

        return $this;
    }

    public function removeInvite(User $invite): self
    {
        if ($this->invites->removeElement($invite)) {
            $invite->removeEvent($this);
        }

        return $this;
    }
}
