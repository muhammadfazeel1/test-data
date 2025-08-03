/**
 * extractDropDown.js
 *
 * npm install cheerio   ← one-time
 *
 * Usage (Node):
 *   node extractDropDown.js
 */

const cheerio = require("cheerio");
const fs = require('fs');

// ─── 1️⃣  Paste ONLY the <ul> … </ul> here ───────────────────────────────────────
const html = `
<div class="select2-drop select2-display-none select2-with-searchbox select2-drop-active" id="select2-drop"
    style="left: 400.25px; width: 334px; top: 409px; bottom: auto; display: block;">
    <div class="select2-search"> <label for="s2id_autogen9846_search" class="select2-offscreen">Project Sector</label>
        <input type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
            class="select2-input" role="combobox" aria-expanded="true" aria-autocomplete="list"
            aria-owns="select2-results-9846" id="s2id_autogen9846_search" placeholder=""
            aria-activedescendant="select2-result-label-9848"> </div>
    <ul class="select2-results" role="listbox" id="select2-results-9846" aria-label="Project Sector">
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9847" role="option"><span
                    class="select2-match"></span>-- None --</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable select2-highlighted"
            role="presentation">
            <div class="select2-result-label" id="select2-result-label-9848" role="option"><span
                    class="select2-match"></span>7 Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9849" role="option"><span
                    class="select2-match"></span>Accounts Payable</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9850" role="option"><span
                    class="select2-match"></span>Addmind</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9851" role="option"><span
                    class="select2-match"></span>Air Mobility</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9852" role="option"><span
                    class="select2-match"></span>Air Mobility Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9853" role="option"><span
                    class="select2-match"></span>Airline</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9854" role="option"><span
                    class="select2-match"></span>Airlines Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9855" role="option"><span
                    class="select2-match"></span>Airport</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9856" role="option"><span
                    class="select2-match"></span>Airports</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9857" role="option"><span
                    class="select2-match"></span>Applications &amp; Platform</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9858" role="option"><span
                    class="select2-match"></span>Archaeological Survey, Excavation and Re</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9859" role="option"><span
                    class="select2-match"></span>Asset Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9860" role="option"><span
                    class="select2-match"></span>Atelier House</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9861" role="option"><span
                    class="select2-match"></span>Audit</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9862" role="option"><span
                    class="select2-match"></span>Authority Coordination</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9863" role="option"><span
                    class="select2-match"></span>Backbone Infrastructure</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9864" role="option"><span
                    class="select2-match"></span>Biotech</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9865" role="option"><span
                    class="select2-match"></span>Board Secretariat</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9866" role="option"><span
                    class="select2-match"></span>Brand</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9867" role="option"><span
                    class="select2-match"></span>Business and Executive Support</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9868" role="option"><span
                    class="select2-match"></span>Business Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9869" role="option"><span
                    class="select2-match"></span>Business Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9870" role="option"><span
                    class="select2-match"></span>Business Solutions</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9871" role="option"><span
                    class="select2-match"></span>Centre of Excellence</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9872" role="option"><span
                    class="select2-match"></span>CEO's Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9873" role="option"><span
                    class="select2-match"></span>CFO Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9874" role="option"><span
                    class="select2-match"></span>Chancellor’s Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9875" role="option"><span
                    class="select2-match"></span>Chief of Staff</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9876" role="option"><span
                    class="select2-match"></span>Chief Of Staff Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9877" role="option"><span
                    class="select2-match"></span>CHRO Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9878" role="option"><span
                    class="select2-match"></span>CISO Office Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9879" role="option"><span
                    class="select2-match"></span>CISO's Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9880" role="option"><span
                    class="select2-match"></span>Client Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9881" role="option"><span
                    class="select2-match"></span>Client Services &amp; Solutions</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9882" role="option"><span
                    class="select2-match"></span>Clincial Care Planning</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9883" role="option"><span
                    class="select2-match"></span>Cognitive Government</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9884" role="option"><span
                    class="select2-match"></span>Commercial</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9885" role="option"><span
                    class="select2-match"></span>Communications</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9886" role="option"><span
                    class="select2-match"></span>Community and Social Responsibility</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9887" role="option"><span
                    class="select2-match"></span>Community Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9888" role="option"><span
                    class="select2-match"></span>Compliance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9889" role="option"><span
                    class="select2-match"></span>Computational Medicine &amp; Digital Health </div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9890" role="option"><span
                    class="select2-match"></span>Compute</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9891" role="option"><span
                    class="select2-match"></span>Conservation and Restoration</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9892" role="option"><span
                    class="select2-match"></span>Core Function</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9893" role="option"><span
                    class="select2-match"></span>Corporate</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9894" role="option"><span
                    class="select2-match"></span>Corporate Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9895" role="option"><span
                    class="select2-match"></span>Corporate Finance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9896" role="option"><span
                    class="select2-match"></span>Corporate Functions</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9897" role="option"><span
                    class="select2-match"></span>Corporate IT</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9898" role="option"><span
                    class="select2-match"></span>Corporate Safety</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9899" role="option"><span
                    class="select2-match"></span>Corporate Services and Asset Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9900" role="option"><span
                    class="select2-match"></span>Corporate Support</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9901" role="option"><span
                    class="select2-match"></span>Cost Estimation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9902" role="option"><span
                    class="select2-match"></span>CSR Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9903" role="option"><span
                    class="select2-match"></span>Culture</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9904" role="option"><span
                    class="select2-match"></span>Customer &amp; Digital</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9905" role="option"><span
                    class="select2-match"></span>Cybersecurity Authority Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9906" role="option"><span
                    class="select2-match"></span>Data Privacy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9907" role="option"><span
                    class="select2-match"></span>Delivery</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9908" role="option"><span
                    class="select2-match"></span>Delivery &amp; Innovation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9909" role="option"><span
                    class="select2-match"></span>Delivery &amp; PMO</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9910" role="option"><span
                    class="select2-match"></span>Deputy CEO's Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9911" role="option"><span
                    class="select2-match"></span>Design</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9912" role="option"><span
                    class="select2-match"></span>Design &amp; Construction Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9913" role="option"><span
                    class="select2-match"></span>Design and Construction</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9914" role="option"><span
                    class="select2-match"></span>Destination Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9915" role="option"><span
                    class="select2-match"></span>Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9916" role="option"><span
                    class="select2-match"></span>Development Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9917" role="option"><span
                    class="select2-match"></span>Digital</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9918" role="option"><span
                    class="select2-match"></span>Digital &amp; Cognitive</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9919" role="option"><span
                    class="select2-match"></span>Digital Government</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9920" role="option"><span
                    class="select2-match"></span>Digitalization</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9921" role="option"><span
                    class="select2-match"></span>Dive Butler</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9922" role="option"><span
                    class="select2-match"></span>DMC</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9923" role="option"><span
                    class="select2-match"></span>EC Corporate</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9924" role="option"><span
                    class="select2-match"></span>EC-12</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9925" role="option"><span
                    class="select2-match"></span>Economics, Data and Statistics</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9926" role="option"><span
                    class="select2-match"></span>Education EC-12</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9927" role="option"><span
                    class="select2-match"></span>Energy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9928" role="option"><span
                    class="select2-match"></span>Engineering &amp; Technical Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9929" role="option"><span
                    class="select2-match"></span>Engineering &amp; Technical Services Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9930" role="option"><span
                    class="select2-match"></span>ENOWA</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9931" role="option"><span
                    class="select2-match"></span>ENOWA Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9932" role="option"><span
                    class="select2-match"></span>Enterprise Project Controls</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9933" role="option"><span
                    class="select2-match"></span>Entertainment</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9934" role="option"><span
                    class="select2-match"></span>Entertainment &amp; Culture Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9935" role="option"><span
                    class="select2-match"></span>Environment</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9936" role="option"><span
                    class="select2-match"></span>Environment Quality</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9937" role="option"><span
                    class="select2-match"></span>Environment Quality &amp; Sustainability</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9938" role="option"><span
                    class="select2-match"></span>Environment Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9939" role="option"><span
                    class="select2-match"></span>ERI Foundation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9940" role="option"><span
                    class="select2-match"></span>ERI Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9941" role="option"><span
                    class="select2-match"></span>F&amp;B (MFC)</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9942" role="option"><span
                    class="select2-match"></span>Facilities Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9943" role="option"><span
                    class="select2-match"></span>Facilities Planning</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9944" role="option"><span
                    class="select2-match"></span>FARSHAH Island</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9945" role="option"><span
                    class="select2-match"></span>Farshah Island</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9946" role="option"><span
                    class="select2-match"></span>Fashion</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9947" role="option"><span
                    class="select2-match"></span>Finance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9948" role="option"><span
                    class="select2-match"></span>Finance Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9949" role="option"><span
                    class="select2-match"></span>Financial Controls</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9950" role="option"><span
                    class="select2-match"></span>Financial Planning &amp; Performance Managem</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9951" role="option"><span
                    class="select2-match"></span>Financial Reporting, Control &amp; Transform</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9952" role="option"><span
                    class="select2-match"></span>Financial Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9953" role="option"><span
                    class="select2-match"></span>Food</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9954" role="option"><span
                    class="select2-match"></span>Founding Board Secretariat</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9955" role="option"><span
                    class="select2-match"></span>Frontier</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9956" role="option"><span
                    class="select2-match"></span>Funding &amp; Decision Support</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9957" role="option"><span
                    class="select2-match"></span>General Counsel Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9958" role="option"><span
                    class="select2-match"></span>General Secretariat of NEOM Entities</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9959" role="option"><span
                    class="select2-match"></span>Governance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9960" role="option"><span
                    class="select2-match"></span>Governance Risk &amp; Compliance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9961" role="option"><span
                    class="select2-match"></span>Governance, Risk &amp; Compliance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9962" role="option"><span
                    class="select2-match"></span>Governance, Risk and Compliance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9963" role="option"><span
                    class="select2-match"></span>Governance, Strategy and Policy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9964" role="option"><span
                    class="select2-match"></span>Government Affairs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9965" role="option"><span
                    class="select2-match"></span>Government Engagements</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9966" role="option"><span
                    class="select2-match"></span>Government Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9967" role="option"><span
                    class="select2-match"></span>Government Services &amp; Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9968" role="option"><span
                    class="select2-match"></span>GRC</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9969" role="option"><span
                    class="select2-match"></span>Grid</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9970" role="option"><span
                    class="select2-match"></span>Ground X</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9971" role="option"><span
                    class="select2-match"></span>Gulf of Aqaba</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9972" role="option"><span
                    class="select2-match"></span>Gulf of Aqaba Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9973" role="option"><span
                    class="select2-match"></span>Head of Authority Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9974" role="option"><span
                    class="select2-match"></span>Health &amp; Wellbeing Leadership</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9975" role="option"><span
                    class="select2-match"></span>Health Financing</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9976" role="option"><span
                    class="select2-match"></span>Health Provision</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9977" role="option"><span
                    class="select2-match"></span>Health Safety &amp; Environment</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9978" role="option"><span
                    class="select2-match"></span>Health System Design &amp; Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9979" role="option"><span
                    class="select2-match"></span>Health Tourism</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9980" role="option"><span
                    class="select2-match"></span>Health, Safety, Environment &amp; Quality</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9981" role="option"><span
                    class="select2-match"></span>Heritage</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9982" role="option"><span
                    class="select2-match"></span>Heritage Site Management &amp; Activation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9983" role="option"><span
                    class="select2-match"></span>Hotel Division</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9984" role="option"><span
                    class="select2-match"></span>Hotels &amp; Development Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9985" role="option"><span
                    class="select2-match"></span>HR Projects</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9986" role="option"><span
                    class="select2-match"></span>Human Resources</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9987" role="option"><span
                    class="select2-match"></span>HWB Authority</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9988" role="option"><span
                    class="select2-match"></span>HWB Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9989" role="option"><span
                    class="select2-match"></span>Hydrogen &amp; Green Fuels</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9990" role="option"><span
                    class="select2-match"></span>IMG</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9991" role="option"><span
                    class="select2-match"></span>Information Technology</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9992" role="option"><span
                    class="select2-match"></span>Infrastructure &amp; ECA Finance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9993" role="option"><span
                    class="select2-match"></span>Infrastructure (T&amp;D)</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9994" role="option"><span
                    class="select2-match"></span>Innovation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9995" role="option"><span
                    class="select2-match"></span>Insurance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9996" role="option"><span
                    class="select2-match"></span>Integration</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9997" role="option"><span
                    class="select2-match"></span>International Investments</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9998" role="option"><span
                    class="select2-match"></span>Investments</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-9999" role="option"><span
                    class="select2-match"></span>Islands</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10000" role="option"><span
                    class="select2-match"></span>Land Conservation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10001" role="option"><span
                    class="select2-match"></span>Land Conservation and Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10002" role="option"><span
                    class="select2-match"></span>Land Development Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10003" role="option"><span
                    class="select2-match"></span>Land Mobility</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10004" role="option"><span
                    class="select2-match"></span>Land Registry</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10005" role="option"><span
                    class="select2-match"></span>Landscapes of The LINE</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10006" role="option"><span
                    class="select2-match"></span>Landscapes of THE LINE</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10007" role="option"><span
                    class="select2-match"></span>Learning &amp; Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10008" role="option"><span
                    class="select2-match"></span>Legal</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10009" role="option"><span
                    class="select2-match"></span>Legal &amp; Compliance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10010" role="option"><span
                    class="select2-match"></span>Legal &amp; GRC</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10011" role="option"><span
                    class="select2-match"></span>Legal Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10012" role="option"><span
                    class="select2-match"></span>Logistics</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10013" role="option"><span
                    class="select2-match"></span>LOTL Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10014" role="option"><span
                    class="select2-match"></span>MAGNA Central</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10015" role="option"><span
                    class="select2-match"></span>Marine Conservation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10016" role="option"><span
                    class="select2-match"></span>Marine Conservations and Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10017" role="option"><span
                    class="select2-match"></span>Marketing</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10018" role="option"><span
                    class="select2-match"></span>Marketing &amp; Communications</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10019" role="option"><span
                    class="select2-match"></span>Marketing and Sales</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10020" role="option"><span
                    class="select2-match"></span>Marriott</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10021" role="option"><span
                    class="select2-match"></span>Master Plans Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10022" role="option"><span
                    class="select2-match"></span>Media</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10023" role="option"><span
                    class="select2-match"></span>Media Industries</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10024" role="option"><span
                    class="select2-match"></span>Media Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10025" role="option"><span
                    class="select2-match"></span>Middle Beast</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10026" role="option"><span
                    class="select2-match"></span>Mining &amp; Green Steel</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10027" role="option"><span
                    class="select2-match"></span>Mo Food</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10028" role="option"><span
                    class="select2-match"></span>Mobility Planning and Integration</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10029" role="option"><span
                    class="select2-match"></span>Municipal Affairs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10030" role="option"><span
                    class="select2-match"></span>Nature Conservation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10031" role="option"><span
                    class="select2-match"></span>Nature Reserve</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10032" role="option"><span
                    class="select2-match"></span>Nature Reserve Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10033" role="option"><span
                    class="select2-match"></span>NC1 School</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10034" role="option"><span
                    class="select2-match"></span>NEOM Authority</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10035" role="option"><span
                    class="select2-match"></span>NEOM Authority - Digital Government Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10036" role="option"><span
                    class="select2-match"></span>NEOM Authority - Economic Development &amp; Office Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10037" role="option"><span
                    class="select2-match"></span>NEOM Authority Activation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10038" role="option"><span
                    class="select2-match"></span>NEOM Authority Activation Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10039" role="option"><span
                    class="select2-match"></span>NEOM Business</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10040" role="option"><span
                    class="select2-match"></span>NEOM Coastal Region</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10041" role="option"><span
                    class="select2-match"></span>NEOM Heritage</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10042" role="option"><span
                    class="select2-match"></span>NEOM Hotel</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10043" role="option"><span
                    class="select2-match"></span>NEOM Industrial City</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10044" role="option"><span
                    class="select2-match"></span>NEOM Infrastructure</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10045" role="option"><span
                    class="select2-match"></span>NEOM Investment Fund</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10046" role="option"><span
                    class="select2-match"></span>NEOM Investment Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10047" role="option"><span
                    class="select2-match"></span>NEOM Islands</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10048" role="option"><span
                    class="select2-match"></span>NEOM Life and Environment</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10049" role="option"><span
                    class="select2-match"></span>NEOM NY Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10050" role="option"><span
                    class="select2-match"></span>NEOM Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10051" role="option"><span
                    class="select2-match"></span>NEOM Operations Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10052" role="option"><span
                    class="select2-match"></span>NEOM Roads</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10053" role="option"><span
                    class="select2-match"></span>NEOM Social Responsibility</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10054" role="option"><span
                    class="select2-match"></span>NEOM U</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10055" role="option"><span
                    class="select2-match"></span>NEOM UK Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10056" role="option"><span
                    class="select2-match"></span>NEOM University Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10057" role="option"><span
                    class="select2-match"></span>NEOM Zero</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10058" role="option"><span
                    class="select2-match"></span>NEOS</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10059" role="option"><span
                    class="select2-match"></span>NIO Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10060" role="option"><span
                    class="select2-match"></span>Onboarding</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10061" role="option"><span
                    class="select2-match"></span>Operational Excellence</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10062" role="option"><span
                    class="select2-match"></span>Operational Procurement</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10063" role="option"><span
                    class="select2-match"></span>Operational Readiness</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10064" role="option"><span
                    class="select2-match"></span>Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10065" role="option"><span
                    class="select2-match"></span>Organization Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10066" role="option"><span
                    class="select2-match"></span>OXAGON</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10067" role="option"><span
                    class="select2-match"></span>Oxagon Port - HSSE</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10068" role="option"><span
                    class="select2-match"></span>OXAGON Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10069" role="option"><span
                    class="select2-match"></span>Partnerships &amp; Innovation Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10070" role="option"><span
                    class="select2-match"></span>Payroll</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10071" role="option"><span
                    class="select2-match"></span>People &amp; Culture</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10072" role="option"><span
                    class="select2-match"></span>People Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10073" role="option"><span
                    class="select2-match"></span>People Strategy &amp; Planning</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10074" role="option"><span
                    class="select2-match"></span>People Technology</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10075" role="option"><span
                    class="select2-match"></span>Performance, Strategy &amp; Digitalization</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10076" role="option"><span
                    class="select2-match"></span>Planning &amp; Municipal Affairs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10077" role="option"><span
                    class="select2-match"></span>Planning &amp; Technical Affairs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10078" role="option"><span
                    class="select2-match"></span>Port and Sea Mobility</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10079" role="option"><span
                    class="select2-match"></span>Port of Oxagon</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10080" role="option"><span
                    class="select2-match"></span>Procurement</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10081" role="option"><span
                    class="select2-match"></span>Project Procurement</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10082" role="option"><span
                    class="select2-match"></span>Project Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10083" role="option"><span
                    class="select2-match"></span>Projects</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10084" role="option"><span
                    class="select2-match"></span>Projects Technical Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10085" role="option"><span
                    class="select2-match"></span>Public Safety</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10086" role="option"><span
                    class="select2-match"></span>Public Services Company</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10087" role="option"><span
                    class="select2-match"></span>Public Works and Initiatives Execution</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10088" role="option"><span
                    class="select2-match"></span>Quality &amp; Excellence</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10089" role="option"><span
                    class="select2-match"></span>Real Estate</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10090" role="option"><span
                    class="select2-match"></span>Real Estate Investments &amp; JVs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10091" role="option"><span
                    class="select2-match"></span>Regional</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10092" role="option"><span
                    class="select2-match"></span>Regional Investments</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10093" role="option"><span
                    class="select2-match"></span>Regional Project</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10094" role="option"><span
                    class="select2-match"></span>Regional Projects and Permitting</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10095" role="option"><span
                    class="select2-match"></span>Regions</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10096" role="option"><span
                    class="select2-match"></span>Resilience</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10097" role="option"><span
                    class="select2-match"></span>Retail</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10098" role="option"><span
                    class="select2-match"></span>Retails</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10099" role="option"><span
                    class="select2-match"></span>Risk</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10100" role="option"><span
                    class="select2-match"></span>RMO</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10101" role="option"><span
                    class="select2-match"></span>RMO - Administration</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10102" role="option"><span
                    class="select2-match"></span>RMO - CEO Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10103" role="option"><span
                    class="select2-match"></span>RMO - Consultation and Deed Transfer</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10104" role="option"><span
                    class="select2-match"></span>RMO - Finance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10105" role="option"><span
                    class="select2-match"></span>RMO - Finance and Accounting</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10106" role="option"><span
                    class="select2-match"></span>RMO - HR</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10107" role="option"><span
                    class="select2-match"></span>RMO - IT</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10108" role="option"><span
                    class="select2-match"></span>RMO - Legal and Standards</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10109" role="option"><span
                    class="select2-match"></span>RMO - Monitoring and Evaluation Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10110" role="option"><span
                    class="select2-match"></span>RMO - Partnerships &amp; Communication</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10111" role="option"><span
                    class="select2-match"></span>RMO - Planning and Studies</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10112" role="option"><span
                    class="select2-match"></span>RMO - PMO</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10113" role="option"><span
                    class="select2-match"></span>RMO - Purchasing and Contracting</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10114" role="option"><span
                    class="select2-match"></span>RMO - Resettlement Operation</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10115" role="option"><span
                    class="select2-match"></span>RMO - Support Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10116" role="option"><span
                    class="select2-match"></span>Scholarship GA</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10117" role="option"><span
                    class="select2-match"></span>Sector Coordination</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10118" role="option"><span
                    class="select2-match"></span>Sectors</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10119" role="option"><span
                    class="select2-match"></span>Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10120" role="option"><span
                    class="select2-match"></span>Shared Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10121" role="option"><span
                    class="select2-match"></span>Shared Services, Strategy, &amp; Performance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10122" role="option"><span
                    class="select2-match"></span>Shushah</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10123" role="option"><span
                    class="select2-match"></span>Sindalah</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10124" role="option"><span
                    class="select2-match"></span>SMART and Livability</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10125" role="option"><span
                    class="select2-match"></span>Social &amp; Digital</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10126" role="option"><span
                    class="select2-match"></span>Special Projects</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10127" role="option"><span
                    class="select2-match"></span>Spine</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10128" role="option"><span
                    class="select2-match"></span>Sport Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10129" role="option"><span
                    class="select2-match"></span>Sports</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10130" role="option"><span
                    class="select2-match"></span>StaffCo</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10131" role="option"><span
                    class="select2-match"></span>StaffCo Corporate Safety (LPFS)</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10132" role="option"><span
                    class="select2-match"></span>StaffCo ENOWA Electrical Grid</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10133" role="option"><span
                    class="select2-match"></span>StaffCo ETSD</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10134" role="option"><span
                    class="select2-match"></span>StaffCo Finance</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10135" role="option"><span
                    class="select2-match"></span>StaffCo Nature Reserve</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10136" role="option"><span
                    class="select2-match"></span>StaffCo Oxagon Project</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10137" role="option"><span
                    class="select2-match"></span>StaffCo Port of Oxagon</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10138" role="option"><span
                    class="select2-match"></span>StaffCo Project Oxagon</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10139" role="option"><span
                    class="select2-match"></span>StaffCo Project Trojena</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10140" role="option"><span
                    class="select2-match"></span>StaffCo Projects Gulf of Aqaba</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10141" role="option"><span
                    class="select2-match"></span>StaffCo Public Safety</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10142" role="option"><span
                    class="select2-match"></span>StaffCo The Line</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10143" role="option"><span
                    class="select2-match"></span>Strategic &amp; Business Advisory</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10144" role="option"><span
                    class="select2-match"></span>Strategic Operations</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10145" role="option"><span
                    class="select2-match"></span>Strategic Partnerships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10146" role="option"><span
                    class="select2-match"></span>Strategic Planning</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10147" role="option"><span
                    class="select2-match"></span>Strategic Projects</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10148" role="option"><span
                    class="select2-match"></span>Strategy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10149" role="option"><span
                    class="select2-match"></span>Strategy &amp; Commercialization</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10150" role="option"><span
                    class="select2-match"></span>Strategy and Project Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10151" role="option"><span
                    class="select2-match"></span>Strategy Development</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10152" role="option"><span
                    class="select2-match"></span>Strategy Office</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10153" role="option"><span
                    class="select2-match"></span>Strategy Office - Corporate</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10154" role="option"><span
                    class="select2-match"></span>Subsidiary Affairs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10155" role="option"><span
                    class="select2-match"></span>Supply Chain &amp; Logistics</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10156" role="option"><span
                    class="select2-match"></span>Sustainable Developments</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10157" role="option"><span
                    class="select2-match"></span>Systems and Reporting</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10158" role="option"><span
                    class="select2-match"></span>Systems and Services</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10159" role="option"><span
                    class="select2-match"></span>Talent Academy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10160" role="option"><span
                    class="select2-match"></span>Talent Acquisition</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10161" role="option"><span
                    class="select2-match"></span>Tax &amp; Customs</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10162" role="option"><span
                    class="select2-match"></span>Technical Consultancy</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10163" role="option"><span
                    class="select2-match"></span>Technology</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10164" role="option"><span
                    class="select2-match"></span>Technology &amp; Science</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10165" role="option"><span
                    class="select2-match"></span>The Line</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10166" role="option"><span
                    class="select2-match"></span>THE LINE</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10167" role="option"><span
                    class="select2-match"></span>THE LINE Facilities Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10168" role="option"><span
                    class="select2-match"></span>The Line Facilities Management Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10169" role="option"><span
                    class="select2-match"></span>THE LINE Proponent</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10170" role="option"><span
                    class="select2-match"></span>Tiran Island</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10171" role="option"><span
                    class="select2-match"></span>TONOMUS</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10172" role="option"><span
                    class="select2-match"></span>TONOMUS Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10173" role="option"><span
                    class="select2-match"></span>Topian</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10174" role="option"><span
                    class="select2-match"></span>Tourism</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10175" role="option"><span
                    class="select2-match"></span>Tourism Sales and Marketing</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10176" role="option"><span
                    class="select2-match"></span>Tourism Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10177" role="option"><span
                    class="select2-match"></span>Travel</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10178" role="option"><span
                    class="select2-match"></span>Treasury</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10179" role="option"><span
                    class="select2-match"></span>TROJENA</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10180" role="option"><span
                    class="select2-match"></span>TROJENA Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10181" role="option"><span
                    class="select2-match"></span>Urban Planning</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10182" role="option"><span
                    class="select2-match"></span>Urban Planning Scholarships</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10183" role="option"><span
                    class="select2-match"></span>Waste Management</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10184" role="option"><span
                    class="select2-match"></span>Water</div>
        </li>
        <li class="select2-results-dept-0 select2-result select2-result-selectable" role="presentation">
            <div class="select2-result-label" id="select2-result-label-10185" role="option"><span
                    class="select2-match"></span>Yuba</div>
        </li>
    </ul>
</div>
`;
// ────────────────────────────────────────────────────────────────────────────────

// 2️⃣  Load & select every <li> inside that <ul>
const $ = cheerio.load(html);
const values = $("li")
  .map((_, li) => $(li).text().trim())
  .get();

fs.writeFileSync(
  "project-sectors.json",
  JSON.stringify(values, null, 2),
  "utf8"
);

// 3️⃣  Do whatever you need with the array
console.log(values);
/* → [
  '-- None --',
  '7 Management',
  'Accounts Payable',
  'Addmind',
  'Air Mobility',
  ...
] */
