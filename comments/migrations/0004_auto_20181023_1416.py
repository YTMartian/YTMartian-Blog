# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-10-23 06:16
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0003_comment_ip_address'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='ip_address',
            field=models.CharField(default='', max_length=20, verbose_name='ip'),
        ),
    ]