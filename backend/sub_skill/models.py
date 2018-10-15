from django.db import models
from skill.models import Skill

# Create your models here.
class SubSkillManager(models.Manager):
  def get_queryset(self):
    return super(SubSkillManager, self).get_queryset().filter(active=True)

class SubSkill(models.Model):
  ### Relation with user
  skill = models.ForeignKey(Skill, related_name='sub_skills', on_delete=models.CASCADE)
  name = models.CharField(blank=False, max_length=50)
  description = models.CharField(blank=True, max_length=50)

  def __str__(self):
    return self.skill.name + ' -> ' + self.name

  class Meta:
    db_table = "sub_skill"
    ordering = ('skill', 'name')
    managed = True
    unique_together = ('name', 'id')