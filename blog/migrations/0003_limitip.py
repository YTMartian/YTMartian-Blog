# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2018-02-13 05:06
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_article_comments'),
    ]

    operations = [
        migrations.CreateModel(
            name='LimitIp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip_address', models.CharField(default='', max_length=20)),
            ],
        ),
    ]
